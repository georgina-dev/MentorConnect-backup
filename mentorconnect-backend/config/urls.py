"""
URL configuration for MentorConnect project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'name': 'MentorConnect API',
        'version': '1.0.0',
        'description': 'Peer Mentorship, Identity Verification & Collaborative Learning Platform',
        'auth_endpoints': {
            'register': '/api/auth/register/',
            'login': '/api/auth/login/',
            'token_refresh': '/api/auth/token/refresh/',
            'current_user': '/api/auth/me/',
            'users_directory': '/api/auth/users/',
            'identity_verification': '/api/auth/verify/',
            'admin_verifications': '/api/auth/admin/verifications/',
            'admin_stats': '/api/auth/admin/stats/',
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
]
