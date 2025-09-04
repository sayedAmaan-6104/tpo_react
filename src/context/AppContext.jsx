import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, getCurrentUserProfile, isAuthenticated } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini-api-key') || '');
  const [selectedLoginRole, setSelectedLoginRole] = useState('student');

  // Check for existing authentication on app start
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const profile = getCurrentUserProfile();
      if (user) {
        setUserData(user);
        setUserRole(user.user_type);
        setUserProfile(profile);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gemini-api-key', apiKey);
  }, [apiKey]);

  const value = {
    userRole,
    setUserRole,
    userData,
    setUserData,
    userProfile,
    setUserProfile,
    isLoading,
    setIsLoading,
    apiKey,
    setApiKey,
    selectedLoginRole,
    setSelectedLoginRole,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
