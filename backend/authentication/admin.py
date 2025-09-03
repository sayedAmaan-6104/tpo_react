from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, RecruiterProfile, UserSession, PasswordResetToken, EmailVerification

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User admin"""
    list_display = ['email', 'username', 'first_name', 'last_name', 'user_type', 'is_verified', 'is_active', 'created_at']
    list_filter = ['user_type', 'is_verified', 'is_active', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'is_verified', 'created_at', 'updated_at')
        }),
    )
    readonly_fields = ['created_at', 'updated_at']

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    """Student profile admin"""
    list_display = ['user', 'student_id', 'university', 'course', 'year_of_study', 'cgpa']
    list_filter = ['university', 'course', 'year_of_study']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'student_id', 'university']
    raw_id_fields = ['user']

@admin.register(RecruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    """Recruiter profile admin"""
    list_display = ['user', 'company_name', 'position', 'industry', 'is_verified']
    list_filter = ['industry', 'is_verified', 'company_size']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'company_name', 'position']
    raw_id_fields = ['user']

@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """User session admin"""
    list_display = ['user', 'session_key', 'ip_address', 'created_at', 'last_activity', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['user__email', 'session_key', 'ip_address']
    readonly_fields = ['session_key', 'created_at']
    raw_id_fields = ['user']

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """Password reset token admin"""
    list_display = ['user', 'token', 'created_at', 'expires_at', 'is_used']
    list_filter = ['is_used', 'created_at']
    search_fields = ['user__email', 'token']
    readonly_fields = ['token', 'created_at']
    raw_id_fields = ['user']

@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    """Email verification admin"""
    list_display = ['user', 'token', 'created_at', 'expires_at', 'is_verified']
    list_filter = ['is_verified', 'created_at']
    search_fields = ['user__email', 'token']
    readonly_fields = ['token', 'created_at']
    raw_id_fields = ['user']
