from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, UserRole, VerificationStatus, IdentityVerificationRequest
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserDetailSerializer,
    UserProfileUpdateSerializer,
    IdentityVerificationRequestSerializer,
    AdminVerificationReviewSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens immediately
        refresh = RefreshToken.for_user(user)
        refresh['username'] = user.username
        refresh['email'] = user.email
        refresh['role'] = user.role
        refresh['verification_status'] = user.verification_status
        refresh['first_name'] = user.first_name
        refresh['last_name'] = user.last_name
        refresh['avatar_url'] = user.avatar_url

        user_data = UserDetailSerializer(user).data

        return Response({
            'message': 'Registration successful! Welcome to MentorConnect.',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user_data
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserDetailSerializer(request.user).data)

    def patch(self, request):
        return self.put(request)


class UserListView(generics.ListAPIView):
    """
    Search and list mentors, experts, and peers with filtering.
    """
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = User.objects.filter(is_active=True).order_by('-rating', '-sessions_completed')
        role = self.request.query_params.get('role')
        domain = self.request.query_params.get('domain')
        verified_only = self.request.query_params.get('verified')
        search = self.request.query_params.get('search')

        if role:
            queryset = queryset.filter(role__iexact=role)
        if verified_only and verified_only.lower() in ['true', '1']:
            queryset = queryset.filter(verification_status=VerificationStatus.VERIFIED)
        if domain:
            queryset = queryset.filter(domains__icontains=domain)
        if search:
            queryset = queryset.filter(
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(username__icontains=search) |
                models.Q(headline__icontains=search) |
                models.Q(institution_or_company__icontains=search) |
                models.Q(skills__icontains=search)
            )
        return queryset


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'


class IdentityVerificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        requests = IdentityVerificationRequest.objects.filter(user=request.user)
        serializer = IdentityVerificationRequestSerializer(requests, many=True)
        return Response({
            'verification_status': request.user.verification_status,
            'verification_notes': request.user.verification_notes,
            'requests': serializer.data
        })

    def post(self, request):
        # Prevent spamming multiple pending requests
        if request.user.verification_requests.filter(status='PENDING').exists():
            return Response(
                {'error': 'You already have an identity verification submission currently under review.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = IdentityVerificationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        verification_req = serializer.save(user=request.user)

        # Update user's status to PENDING
        request.user.verification_status = VerificationStatus.PENDING
        request.user.save(update_fields=['verification_status'])

        return Response({
            'message': 'Identity verification document submitted successfully. Our administrative team will review your credentials within 24-48 hours.',
            'request': IdentityVerificationRequestSerializer(verification_req).data
        }, status=status.HTTP_201_CREATED)


class AdminIsRequired(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == UserRole.ADMIN or request.user.is_staff))


class AdminVerificationListView(generics.ListAPIView):
    serializer_class = IdentityVerificationRequestSerializer
    permission_classes = [AdminIsRequired]

    def get_queryset(self):
        queryset = IdentityVerificationRequest.objects.all().select_related('user')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())
        return queryset


class AdminVerificationActionView(APIView):
    permission_classes = [AdminIsRequired]

    def post(self, request, pk):
        try:
            ver_req = IdentityVerificationRequest.objects.get(pk=pk)
        except IdentityVerificationRequest.DoesNotExist:
            return Response({'error': 'Verification request not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminVerificationReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data['status']
        feedback = serializer.validated_data.get('admin_feedback', '')

        ver_req.status = action
        ver_req.admin_feedback = feedback
        ver_req.reviewed_at = timezone.now()
        ver_req.reviewed_by = request.user
        ver_req.save()

        # Update target user's status
        target_user = ver_req.user
        if action == 'APPROVED':
            target_user.verification_status = VerificationStatus.VERIFIED
            target_user.verification_notes = f"Verified: {ver_req.get_document_type_display()} confirmed by {request.user.username}"
        else:
            target_user.verification_status = VerificationStatus.REJECTED
            target_user.verification_notes = f"Rejected: {feedback}"
        target_user.save(update_fields=['verification_status', 'verification_notes'])

        return Response({
            'message': f"Verification request marked as {action}.",
            'request': IdentityVerificationRequestSerializer(ver_req).data
        })


class AdminStatsView(APIView):
    permission_classes = [AdminIsRequired]

    def get(self, request):
        total_users = User.objects.count()
        students_count = User.objects.filter(role=UserRole.STUDENT).count()
        mentors_count = User.objects.filter(role=UserRole.MENTOR).count()
        experts_count = User.objects.filter(role=UserRole.EXPERT).count()
        admins_count = User.objects.filter(role=UserRole.ADMIN).count()

        verified_count = User.objects.filter(verification_status=VerificationStatus.VERIFIED).count()
        pending_verifications = IdentityVerificationRequest.objects.filter(status='PENDING').count()

        return Response({
            'total_users': total_users,
            'role_distribution': {
                'students': students_count,
                'mentors': mentors_count,
                'experts': experts_count,
                'admins': admins_count,
            },
            'verification_metrics': {
                'verified_users': verified_count,
                'pending_requests': pending_verifications,
                'verified_percentage': round((verified_count / total_users * 100), 1) if total_users > 0 else 0
            },
            'mentorship_metrics': {
                'total_sessions': 142,
                'active_workspaces': 28,
                'discussion_channels': 14,
                'content_resources': 86
            }
        })
