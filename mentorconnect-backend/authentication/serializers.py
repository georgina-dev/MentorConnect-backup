from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, UserRole, VerificationStatus, IdentityVerificationRequest


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Custom claims in JWT payload
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['verification_status'] = user.verification_status
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['avatar_url'] = user.avatar_url
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add extra user profile fields in response body
        user = self.user
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'verification_status': user.verification_status,
            'headline': user.headline,
            'institution_or_company': user.institution_or_company,
            'degree_or_title': user.degree_or_title,
            'avatar_url': user.avatar_url,
            'domains': user.domains,
            'skills': user.skills,
            'rating': user.rating,
            'sessions_completed': user.sessions_completed,
            'students_mentored': user.students_mentored,
        }
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'password', 'password_confirm',
            'role', 'headline', 'bio', 'institution_or_company', 'degree_or_title',
            'domains', 'skills', 'avatar_url'
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        email = attrs.get('email')
        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "A user with this email address already exists."})
            
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        
        # If user registered as student, initial verification status is unverified or auto-verified depending on institution
        user = User(**validated_data)
        user.set_password(password)
        
        # Default avatar fallback if not provided
        if not user.avatar_url:
            name_seed = user.first_name or user.username
            user.avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={name_seed}"
            
        user.save()
        return user


class UserDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'verification_status', 'verification_notes',
            'headline', 'bio', 'institution_or_company', 'degree_or_title',
            'avatar_url', 'domains', 'skills',
            'github_profile', 'linkedin_profile', 'portfolio_url',
            'years_of_experience', 'rating', 'total_reviews',
            'sessions_completed', 'students_mentored',
            'is_available_for_mentorship', 'hourly_rate',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'username', 'verification_status', 'verification_notes',
            'rating', 'total_reviews', 'sessions_completed', 'students_mentored',
            'created_at', 'updated_at'
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'headline', 'bio',
            'institution_or_company', 'degree_or_title', 'avatar_url',
            'domains', 'skills', 'github_profile', 'linkedin_profile',
            'portfolio_url', 'years_of_experience', 'is_available_for_mentorship', 'hourly_rate'
        ]


class IdentityVerificationRequestSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = IdentityVerificationRequest
        fields = [
            'id', 'user', 'user_details', 'document_type', 'document_number_or_info',
            'document_file_url', 'institution_name', 'notes', 'status',
            'admin_feedback', 'submitted_at', 'reviewed_at', 'reviewed_by'
        ]
        read_only_fields = ['id', 'user', 'status', 'admin_feedback', 'submitted_at', 'reviewed_at', 'reviewed_by']

    def get_user_details(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'full_name': f"{obj.user.first_name} {obj.user.last_name}".strip(),
            'email': obj.user.email,
            'role': obj.user.role,
            'current_verification_status': obj.user.verification_status,
            'institution_or_company': obj.user.institution_or_company
        }


class AdminVerificationReviewSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['APPROVED', 'REJECTED'])
    admin_feedback = serializers.CharField(required=False, allow_blank=True, default='')
