from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # Registration endpoints
    path('register/student/', views.StudentRegistrationView.as_view(), name='student_register'),
    path('register/recruiter/', views.RecruiterRegistrationView.as_view(), name='recruiter_register'),
    
    # Authentication endpoints
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('check-auth/', views.check_auth_status, name='check_auth'),
    
    # Profile endpoints
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('profile/student/update/', views.StudentProfileUpdateView.as_view(), name='student_profile_update'),
    path('profile/recruiter/update/', views.RecruiterProfileUpdateView.as_view(), name='recruiter_profile_update'),
    
    # Password management
    path('password/change/', views.PasswordChangeView.as_view(), name='password_change'),
    path('password/reset/request/', views.PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password/reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
