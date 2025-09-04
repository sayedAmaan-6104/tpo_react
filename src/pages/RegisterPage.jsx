import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import RegistrationForm from '../components/RegistrationForm';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUserRole, setUserData, setUserProfile, selectedLoginRole } = useAppContext();

  const handleRegister = (userType, userData) => {
    // Registration success - user data comes from API response
    const { user } = userData;
    
    setUserRole(user.user_type);
    setUserData(user);
    
    // Navigate to appropriate dashboard based on user type
    if (user.user_type === 'student') {
      navigate('/student/dashboard');
    } else if (user.user_type === 'recruiter') {
      navigate('/recruiter/dashboard');
    }
    
    console.log(`${user.user_type} registered:`, user);
  };

  const handleBackToWelcome = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <RegistrationForm
      onRegister={handleRegister}
      onBackToWelcome={handleBackToWelcome}
      onGoToLogin={handleGoToLogin}
      defaultRole={selectedLoginRole}
    />
  );
};

export default RegisterPage;
