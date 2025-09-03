from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import uuid
from datetime import datetime, timedelta
from django.utils import timezone

from .models import User, StudentProfile, RecruiterProfile, PasswordResetToken, EmailVerification
from .serializers import (
    UserSerializer, StudentProfileSerializer, RecruiterProfileSerializer,
    StudentRegistrationSerializer, RecruiterRegistrationSerializer,
    LoginSerializer, PasswordChangeSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)

class StudentRegistrationView(APIView):
    """Student registration endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = StudentRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Student registered successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecruiterRegistrationView(APIView):
    """Recruiter registration endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = RecruiterRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Recruiter registered successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """Login endpoint for both students and recruiters"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            # Get profile data based on user type
            profile_data = None
            if user.user_type == 'student':
                try:
                    profile = user.student_profile
                    profile_data = StudentProfileSerializer(profile).data
                except StudentProfile.DoesNotExist:
                    profile_data = None
            elif user.user_type == 'recruiter':
                try:
                    profile = user.recruiter_profile
                    profile_data = RecruiterProfileSerializer(profile).data
                except RecruiterProfile.DoesNotExist:
                    profile_data = None
            
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'profile': profile_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """Logout endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    """Get current user profile"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data
        
        profile_data = None
        if user.user_type == 'student':
            try:
                profile = user.student_profile
                profile_data = StudentProfileSerializer(profile).data
            except StudentProfile.DoesNotExist:
                profile_data = None
        elif user.user_type == 'recruiter':
            try:
                profile = user.recruiter_profile
                profile_data = RecruiterProfileSerializer(profile).data
            except RecruiterProfile.DoesNotExist:
                profile_data = None
        
        return Response({
            'user': user_data,
            'profile': profile_data
        }, status=status.HTTP_200_OK)

class StudentProfileUpdateView(APIView):
    """Update student profile"""
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request):
        if request.user.user_type != 'student':
            return Response({
                'error': 'Only students can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            profile = request.user.student_profile
        except StudentProfile.DoesNotExist:
            profile = StudentProfile.objects.create(user=request.user)
        
        serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'profile': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecruiterProfileUpdateView(APIView):
    """Update recruiter profile"""
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request):
        if request.user.user_type != 'recruiter':
            return Response({
                'error': 'Only recruiters can access this endpoint'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            profile = request.user.recruiter_profile
        except RecruiterProfile.DoesNotExist:
            profile = RecruiterProfile.objects.create(user=request.user)
        
        serializer = RecruiterProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'profile': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordChangeView(APIView):
    """Change password"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    """Request password reset"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                
                # Create reset token
                token = str(uuid.uuid4())
                expires_at = timezone.now() + timedelta(hours=1)
                
                PasswordResetToken.objects.create(
                    user=user,
                    token=token,
                    expires_at=expires_at
                )
                
                # In a real application, send email here
                # For now, we'll return the token (remove this in production)
                return Response({
                    'message': 'Password reset token generated',
                    'token': token  # Remove this in production
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                # Don't reveal if user exists or not
                return Response({
                    'message': 'If a user with this email exists, a reset link will be sent'
                }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    """Confirm password reset"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            try:
                reset_token = PasswordResetToken.objects.get(
                    token=token,
                    is_used=False,
                    expires_at__gt=timezone.now()
                )
                
                user = reset_token.user
                user.set_password(new_password)
                user.save()
                
                # Mark token as used
                reset_token.is_used = True
                reset_token.save()
                
                return Response({
                    'message': 'Password reset successful'
                }, status=status.HTTP_200_OK)
                
            except PasswordResetToken.DoesNotExist:
                return Response({
                    'error': 'Invalid or expired reset token'
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_auth_status(request):
    """Check if user is authenticated"""
    user = request.user
    user_data = UserSerializer(user).data
    
    profile_data = None
    if user.user_type == 'student':
        try:
            profile = user.student_profile
            profile_data = StudentProfileSerializer(profile).data
        except StudentProfile.DoesNotExist:
            profile_data = None
    elif user.user_type == 'recruiter':
        try:
            profile = user.recruiter_profile
            profile_data = RecruiterProfileSerializer(profile).data
        except RecruiterProfile.DoesNotExist:
            profile_data = None
    
    return Response({
        'is_authenticated': True,
        'user': user_data,
        'profile': profile_data
    }, status=status.HTTP_200_OK)
