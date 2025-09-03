from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, StudentProfile, RecruiterProfile

class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'user_type', 'is_verified', 'created_at']
        read_only_fields = ['id', 'created_at']

class StudentProfileSerializer(serializers.ModelSerializer):
    """Student profile serializer"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = [
            'user', 'student_id', 'university', 'course', 'year_of_study', 
            'cgpa', 'phone_number', 'date_of_birth', 'resume', 'skills',
            'linkedin_url', 'github_url'
        ]

class RecruiterProfileSerializer(serializers.ModelSerializer):
    """Recruiter profile serializer"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = RecruiterProfile
        fields = [
            'user', 'company_name', 'company_website', 'company_description',
            'position', 'phone_number', 'company_address', 'industry',
            'company_size', 'is_verified'
        ]

class StudentRegistrationSerializer(serializers.ModelSerializer):
    """Student registration serializer"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    # Student profile fields
    student_id = serializers.CharField(required=False, allow_blank=True)
    university = serializers.CharField(required=False, allow_blank=True)
    course = serializers.CharField(required=False, allow_blank=True)
    year_of_study = serializers.IntegerField(required=False, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'password', 
            'password_confirm', 'student_id', 'university', 'course', 
            'year_of_study', 'phone_number'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirm and profile fields
        validated_data.pop('password_confirm')
        profile_data = {
            'student_id': validated_data.pop('student_id', ''),
            'university': validated_data.pop('university', ''),
            'course': validated_data.pop('course', ''),
            'year_of_study': validated_data.pop('year_of_study', None),
            'phone_number': validated_data.pop('phone_number', ''),
        }
        
        # Create user
        validated_data['user_type'] = 'student'
        user = User.objects.create_user(**validated_data)
        
        # Create student profile
        StudentProfile.objects.create(user=user, **profile_data)
        
        return user

class RecruiterRegistrationSerializer(serializers.ModelSerializer):
    """Recruiter registration serializer"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    # Recruiter profile fields
    company_name = serializers.CharField()
    company_website = serializers.URLField(required=False, allow_blank=True)
    position = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    industry = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'password', 
            'password_confirm', 'company_name', 'company_website', 
            'position', 'phone_number', 'industry'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirm and profile fields
        validated_data.pop('password_confirm')
        profile_data = {
            'company_name': validated_data.pop('company_name'),
            'company_website': validated_data.pop('company_website', ''),
            'position': validated_data.pop('position', ''),
            'phone_number': validated_data.pop('phone_number', ''),
            'industry': validated_data.pop('industry', ''),
        }
        
        # Create user
        validated_data['user_type'] = 'recruiter'
        user = User.objects.create_user(**validated_data)
        
        # Create recruiter profile
        RecruiterProfile.objects.create(user=user, **profile_data)
        
        return user

class LoginSerializer(serializers.Serializer):
    """Login serializer"""
    email = serializers.EmailField()
    password = serializers.CharField()
    user_type = serializers.ChoiceField(choices=['student', 'recruiter'])
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user_type = attrs.get('user_type')
        
        if email and password:
            # Authenticate user
            user = authenticate(username=email, password=password)
            
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            
            if user.user_type != user_type:
                raise serializers.ValidationError(f'Invalid user type. Expected {user_type}.')
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password.')

class PasswordChangeSerializer(serializers.Serializer):
    """Password change serializer"""
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match.")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value

class PasswordResetRequestSerializer(serializers.Serializer):
    """Password reset request serializer"""
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    """Password reset confirm serializer"""
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
