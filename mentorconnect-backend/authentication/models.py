from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    STUDENT = 'STUDENT', 'Student / Mentee'
    MENTOR = 'MENTOR', 'Peer Mentor'
    EXPERT = 'EXPERT', 'Industry & Academic Expert'
    ADMIN = 'ADMIN', 'Administrator'


class VerificationStatus(models.TextChoices):
    UNVERIFIED = 'UNVERIFIED', 'Unverified'
    PENDING = 'PENDING', 'Pending Verification'
    VERIFIED = 'VERIFIED', 'Verified'
    REJECTED = 'REJECTED', 'Verification Rejected'


class User(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.STUDENT,
        help_text="User role in the peer mentorship platform"
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.UNVERIFIED,
        help_text="Identity verification state"
    )
    verification_notes = models.TextField(blank=True, default='')
    
    # Profile information
    headline = models.CharField(max_length=255, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    institution_or_company = models.CharField(max_length=255, blank=True, default='')
    degree_or_title = models.CharField(max_length=255, blank=True, default='')
    avatar_url = models.CharField(max_length=500, blank=True, default='')
    
    # Domains and skills (stored as JSON arrays, e.g. ["Computer Science", "Data Science"])
    domains = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    
    # Professional links & metrics
    github_profile = models.URLField(max_length=300, blank=True, default='')
    linkedin_profile = models.URLField(max_length=300, blank=True, default='')
    portfolio_url = models.URLField(max_length=300, blank=True, default='')
    
    # Mentorship stats
    years_of_experience = models.PositiveIntegerField(default=0)
    rating = models.FloatField(default=5.0)
    total_reviews = models.PositiveIntegerField(default=0)
    sessions_completed = models.PositiveIntegerField(default=0)
    students_mentored = models.PositiveIntegerField(default=0)
    
    # Availability
    is_available_for_mentorship = models.BooleanField(default=True)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, default=0.00, help_text="0.00 for volunteer peer mentorship")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()} - {self.verification_status})"


class IdentityVerificationRequest(models.Model):
    DOCUMENT_TYPES = [
        ('STUDENT_ID', 'University / College Student ID'),
        ('ACADEMIC_EMAIL', 'Verified Academic Email (.edu / institutional)'),
        ('DIPLOMA_DEGREE', 'Degree / Diploma Certificate'),
        ('EMPLOYMENT_PROOF', 'Employment Verification / Offer Letter'),
        ('GOVERNMENT_ID', 'Government-Issued Identity Card / Passport'),
        ('PORTFOLIO_CREDENTIAL', 'Professional License or Industry Certification'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_requests')
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    document_number_or_info = models.CharField(max_length=255, help_text="ID number, document identifier or link")
    document_file_url = models.CharField(max_length=500, blank=True, default='', help_text="Uploaded document link or preview path")
    institution_name = models.CharField(max_length=255, blank=True, default='')
    notes = models.TextField(blank=True, default='', help_text="Context or comments from the user")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_feedback = models.TextField(blank=True, default='')
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_verifications'
    )

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"Verification for {self.user.username} - {self.status}"
