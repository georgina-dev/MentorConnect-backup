from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    CurrentUserView,
    UserListView,
    UserDetailView,
    IdentityVerificationView,
    AdminVerificationListView,
    AdminVerificationActionView,
    AdminStatsView
)

urlpatterns = [
    # Auth & Tokens
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', CurrentUserView.as_view(), name='auth_me'),

    # Users & Profiles
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user_detail'),

    # Identity Verification
    path('verify/', IdentityVerificationView.as_view(), name='identity_verify'),

    # Admin Management
    path('admin/verifications/', AdminVerificationListView.as_view(), name='admin_verifications'),
    path('admin/verifications/<int:pk>/action/', AdminVerificationActionView.as_view(), name='admin_verification_action'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
]
