import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api/auth/', // Use proxy path instead of full URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session-based auth
});

// Request interceptor to add authentication token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data on unauthorized access
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_profile');
      // Redirect to login page or show login modal
      window.location.href = '/'; // Redirect to welcome page
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // Student registration
  registerStudent: async (userData) => {
    try {
      const response = await api.post('register/student/', {
        username: userData.email, // Using email as username
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: userData.password,
        password_confirm: userData.confirmPassword,
        student_id: userData.studentId,
        university: userData.university,
        course: userData.department, // Map department to course
        year_of_study: parseInt(userData.graduationYear) - new Date().getFullYear() + 4, // Calculate year of study
        phone_number: userData.phone
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Registration failed',
        errors: error.response?.data?.errors || {}
      };
    }
  },

  // Recruiter registration
  registerRecruiter: async (userData) => {
    try {
      const response = await api.post('register/recruiter/', {
        username: userData.email, // Using email as username
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: userData.password,
        password_confirm: userData.confirmPassword,
        company_name: userData.companyName,
        company_website: userData.companyWebsite,
        position: userData.position,
        phone_number: userData.phone,
        company_size: userData.companySize,
        industry: 'Technology' // Default industry, can be made dynamic
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Registration failed',
        errors: error.response?.data?.errors || {}
      };
    }
  },

  // Login
  login: async (email, password, userType) => {
    try {
      const response = await api.post('login/', {
        email,
        password,
        user_type: userType
      });
      
      // Store auth data in localStorage
      if (response.data.user) {
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        if (response.data.profile) {
          localStorage.setItem('user_profile', JSON.stringify(response.data.profile));
        }
        // Note: If using token auth, store the token
        // localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Login failed',
        errors: error.response?.data?.errors || {}
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('logout/');
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_profile');
      return { message: 'Logged out successfully' };
    } catch (error) {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_profile');
      throw {
        message: error.response?.data?.error || 'Logout failed'
      };
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const response = await api.get('check-auth/');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Authentication check failed'
      };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('profile/');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Failed to fetch profile'
      };
    }
  }
};

// Utility functions
export const isAuthenticated = () => {
  const userData = localStorage.getItem('user_data');
  return !!userData;
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

export const getCurrentUserProfile = () => {
  const profileData = localStorage.getItem('user_profile');
  return profileData ? JSON.parse(profileData) : null;
};

export default api;
