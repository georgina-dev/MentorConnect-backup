from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, IdentityVerificationRequest


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'verification_status', 'institution_or_company', 'is_staff', 'date_joined')
    list_filter = ('role', 'verification_status', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'institution_or_company')
    
    fieldsets = UserAdmin.fieldsets + (
        ('MentorConnect Profile Details', {
            'fields': (
                'role', 'verification_status', 'verification_notes',
                'headline', 'bio', 'institution_or_company', 'degree_or_title',
                'avatar_url', 'domains', 'skills',
                'github_profile', 'linkedin_profile', 'portfolio_url',
                'years_of_experience', 'rating', 'total_reviews',
                'sessions_completed', 'students_mentored',
                'is_available_for_mentorship', 'hourly_rate'
            )
        }),
    )


@admin.register(IdentityVerificationRequest)
class IdentityVerificationRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'document_type', 'status', 'submitted_at', 'reviewed_at', 'reviewed_by')
    list_filter = ('status', 'document_type', 'submitted_at')
    search_fields = ('user__username', 'user__email', 'institution_name', 'document_number_or_info')
    readonly_fields = ('submitted_at',)
