import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUserRole, setUserData, setUserProfile, selectedLoginRole } = useAppContext();

  const handleLogin = (userType, userData) => {
    // Authentication success - user data comes from API response
    const { user, profile } = userData;
    
    setUserRole(user.user_type);
    setUserData(user);
    if (profile) {
      setUserProfile(profile);
    }
    
    // Navigate to appropriate dashboard based on user type
    if (user.user_type === 'student') {
      navigate('/student/dashboard');
    } else if (user.user_type === 'recruiter') {
      navigate('/recruiter/dashboard');
    }
    
    console.log(`${user.user_type} logged in:`, user);
  };

  const handleBackToWelcome = () => {
    navigate('/');
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onBackToWelcome={handleBackToWelcome}
      onGoToRegister={handleGoToRegister}
      defaultRole={selectedLoginRole}
    />
  );
};

export default LoginPage;
