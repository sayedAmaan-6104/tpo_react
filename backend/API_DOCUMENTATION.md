# TPO Backend API Documentation

## Base URL
```
http://localhost:8000/api/auth/
```

## Authentication Endpoints

### 1. Student Registration
**POST** `/register/student/`

Register a new student account.

**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john.doe@university.edu",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "student_id": "STU001",
    "university": "ABC University",
    "course": "Computer Science",
    "year_of_study": 3,
    "phone_number": "+1234567890"
}
```

**Response (201 Created):**
```json
{
    "message": "Student registered successfully",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john.doe@university.edu",
        "first_name": "John",
        "last_name": "Doe",
        "user_type": "student",
        "is_verified": false,
        "created_at": "2025-09-03T20:00:00Z"
    }
}
```

### 2. Recruiter Registration
**POST** `/register/recruiter/`

Register a new recruiter account.

**Request Body:**
```json
{
    "username": "jane_recruiter",
    "email": "jane@techcorp.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "company_name": "TechCorp Inc.",
    "company_website": "https://techcorp.com",
    "position": "HR Manager",
    "phone_number": "+1234567890",
    "industry": "Technology"
}
```

**Response (201 Created):**
```json
{
    "message": "Recruiter registered successfully",
    "user": {
        "id": 2,
        "username": "jane_recruiter",
        "email": "jane@techcorp.com",
        "first_name": "Jane",
        "last_name": "Smith",
        "user_type": "recruiter",
        "is_verified": false,
        "created_at": "2025-09-03T20:00:00Z"
    }
}
```

### 3. Login
**POST** `/login/`

Login for both students and recruiters.

**Request Body:**
```json
{
    "email": "john.doe@university.edu",
    "password": "securepassword123",
    "user_type": "student"
}
```

**Response (200 OK):**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john.doe@university.edu",
        "first_name": "John",
        "last_name": "Doe",
        "user_type": "student",
        "is_verified": false,
        "created_at": "2025-09-03T20:00:00Z"
    },
    "profile": {
        "user": {...},
        "student_id": "STU001",
        "university": "ABC University",
        "course": "Computer Science",
        "year_of_study": 3,
        "cgpa": null,
        "phone_number": "+1234567890",
        "date_of_birth": null,
        "resume": null,
        "skills": null,
        "linkedin_url": null,
        "github_url": null
    }
}
```

### 4. Logout
**POST** `/logout/`

**Headers:** `Authorization: Bearer <token>` (if using token auth) or session cookie

**Response (200 OK):**
```json
{
    "message": "Logout successful"
}
```

### 5. Check Authentication Status
**GET** `/check-auth/`

**Headers:** Authentication required

**Response (200 OK):**
```json
{
    "is_authenticated": true,
    "user": {...},
    "profile": {...}
}
```

## Profile Management

### 6. Get User Profile
**GET** `/profile/`

**Headers:** Authentication required

**Response (200 OK):**
```json
{
    "user": {...},
    "profile": {...}
}
```

### 7. Update Student Profile
**PUT** `/profile/student/update/`

**Headers:** Authentication required (student only)

**Request Body:**
```json
{
    "student_id": "STU001",
    "university": "ABC University",
    "course": "Computer Science",
    "year_of_study": 4,
    "cgpa": 8.5,
    "phone_number": "+1234567890",
    "date_of_birth": "2000-01-15",
    "skills": "Python, JavaScript, React, Django",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "github_url": "https://github.com/johndoe"
}
```

### 8. Update Recruiter Profile
**PUT** `/profile/recruiter/update/`

**Headers:** Authentication required (recruiter only)

**Request Body:**
```json
{
    "company_name": "TechCorp Inc.",
    "company_website": "https://techcorp.com",
    "company_description": "Leading technology company",
    "position": "Senior HR Manager",
    "phone_number": "+1234567890",
    "company_address": "123 Tech Street, Silicon Valley",
    "industry": "Technology",
    "company_size": "1000-5000"
}
```

## Password Management

### 9. Change Password
**POST** `/password/change/`

**Headers:** Authentication required

**Request Body:**
```json
{
    "old_password": "oldpassword123",
    "new_password": "newpassword123",
    "new_password_confirm": "newpassword123"
}
```

### 10. Request Password Reset
**POST** `/password/reset/request/`

**Request Body:**
```json
{
    "email": "john.doe@university.edu"
}
```

**Response (200 OK):**
```json
{
    "message": "Password reset token generated",
    "token": "uuid-token-here"  // Remove in production
}
```

### 11. Confirm Password Reset
**POST** `/password/reset/confirm/`

**Request Body:**
```json
{
    "token": "uuid-token-here",
    "new_password": "newpassword123",
    "new_password_confirm": "newpassword123"
}
```

## Error Responses

### Validation Error (400 Bad Request)
```json
{
    "field_name": ["Error message"],
    "email": ["This field is required."],
    "password": ["This password is too short."]
}
```

### Authentication Error (401 Unauthorized)
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### Permission Error (403 Forbidden)
```json
{
    "error": "Only students can access this endpoint"
}
```

### Not Found (404 Not Found)
```json
{
    "detail": "Not found."
}
```

## Frontend Integration

### Setting up Axios for API calls

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/auth';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for session authentication
    headers: {
        'Content-Type': 'application/json',
    },
});

// Student registration
export const registerStudent = async (userData) => {
    const response = await api.post('/register/student/', userData);
    return response.data;
};

// Recruiter registration
export const registerRecruiter = async (userData) => {
    const response = await api.post('/register/recruiter/', userData);
    return response.data;
};

// Login
export const login = async (credentials) => {
    const response = await api.post('/login/', credentials);
    return response.data;
};

// Logout
export const logout = async () => {
    const response = await api.post('/logout/');
    return response.data;
};

// Check auth status
export const checkAuthStatus = async () => {
    const response = await api.get('/check-auth/');
    return response.data;
};
```

### Example Frontend Usage

```javascript
// Student registration
const handleStudentRegistration = async (formData) => {
    try {
        const result = await registerStudent({
            username: formData.username,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            password: formData.password,
            password_confirm: formData.passwordConfirm,
            student_id: formData.studentId,
            university: formData.university,
            course: formData.course,
            year_of_study: formData.yearOfStudy,
            phone_number: formData.phoneNumber
        });
        
        console.log('Registration successful:', result);
        // Redirect or show success message
    } catch (error) {
        console.error('Registration failed:', error.response.data);
        // Show error messages
    }
};

// Login
const handleLogin = async (formData) => {
    try {
        const result = await login({
            email: formData.email,
            password: formData.password,
            user_type: formData.userType // 'student' or 'recruiter'
        });
        
        console.log('Login successful:', result);
        // Store user data and redirect
    } catch (error) {
        console.error('Login failed:', error.response.data);
        // Show error messages
    }
};
```

## Database Models

### User Model
- id (AutoField)
- username (CharField, unique)
- email (EmailField, unique)
- first_name (CharField)
- last_name (CharField)
- user_type (CharField: 'student', 'recruiter', 'admin')
- is_verified (BooleanField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

### StudentProfile Model
- user (OneToOneField -> User)
- student_id (CharField, unique)
- university (CharField)
- course (CharField)
- year_of_study (IntegerField)
- cgpa (DecimalField)
- phone_number (CharField)
- date_of_birth (DateField)
- resume (FileField)
- skills (TextField)
- linkedin_url (URLField)
- github_url (URLField)

### RecruiterProfile Model
- user (OneToOneField -> User)
- company_name (CharField)
- company_website (URLField)
- company_description (TextField)
- position (CharField)
- phone_number (CharField)
- company_address (TextField)
- industry (CharField)
- company_size (CharField)
- is_verified (BooleanField)

## Security Features

1. **Password Validation**: Built-in Django password validators
2. **CSRF Protection**: Enabled for form submissions
3. **CORS Configuration**: Configured for frontend integration
4. **Session Management**: Secure session handling
5. **Password Reset Tokens**: Time-limited tokens for password reset
6. **User Type Validation**: Ensures users can only access appropriate endpoints

## Next Steps

1. Add email verification functionality
2. Implement file upload for resumes
3. Add job posting and application features
4. Implement advanced search and filtering
5. Add notification system
6. Implement real-time chat/messaging
7. Add analytics and reporting features
