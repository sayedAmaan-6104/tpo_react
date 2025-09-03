import React, { useState, useEffect } from 'react';
import './LoginForm.css';

const LoginForm = ({ onLogin, onBackToWelcome, defaultRole = 'student' }) => {
  const [activeTab, setActiveTab] = useState(defaultRole);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Update activeTab when defaultRole changes
  useEffect(() => {
    setActiveTab(defaultRole);
  }, [defaultRole]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication logic
      if (formData.email && formData.password) {
        onLogin(activeTab, formData);
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented here');
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="bg-element bg-primary"></div>
      <div className="bg-element bg-secondary"></div>
      <div className="bg-element bg-accent"></div>
      
      {/* Floating Dots */}
      <div className="floating-dot dot-1"></div>
      <div className="floating-dot dot-2"></div>
      <div className="floating-dot dot-3"></div>

      <div className="form-container">
        {/* Back Button */}
        <button 
          className="back-button"
          onClick={onBackToWelcome}
        >
          <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Welcome
        </button>

        <div className="login-card">
          <div className="card-header">
            {/* Logo/Icon */}
            <div className="logo-container">
              <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-description">Sign in to your TPO Portal account</p>
          </div>

          <div className="card-content">
            <div className="tabs">
              <div className="tabs-list">
                <button 
                  type="button"
                  className="tab-trigger"
                  data-active={activeTab === 'student'}
                  data-role="student"
                  onClick={() => setActiveTab('student')}
                >
                  <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Student
                </button>
                <button 
                  type="button"
                  className="tab-trigger"
                  data-active={activeTab === 'recruiter'}
                  data-role="recruiter"
                  onClick={() => setActiveTab('recruiter')}
                >
                  <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Recruiter
                </button>
              </div>

              {/* Student Login Form */}
              {activeTab === 'student' && (
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-field">
                    <label htmlFor="student-email" className="form-label">
                      Student Email
                    </label>
                    <input
                      id="student-email"
                      name="email"
                      type="email"
                      placeholder="john.doe@university.edu"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && (
                      <p className="error-message">{errors.email}</p>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="student-password" className="form-label">
                      Password
                    </label>
                    <input
                      id="student-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${errors.password ? 'input-error' : ''}`}
                    />
                    {errors.password && (
                      <p className="error-message">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between form-field">
                    <div className="checkbox-container">
                      <input
                        id="remember-student"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="remember-checkbox"
                      />
                      <label htmlFor="remember-student" className="checkbox-label">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="button"
                      className="forgot-password"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {errors.submit && (
                    <p className="error-message">{errors.submit}</p>
                  )}

                  <button 
                    type="submit"
                    className="submit-button student-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="loading-text">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Sign in as Student
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Recruiter Login Form */}
              {activeTab === 'recruiter' && (
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-field">
                    <label htmlFor="recruiter-email" className="form-label">
                      Company Email
                    </label>
                    <input
                      id="recruiter-email"
                      name="email"
                      type="email"
                      placeholder="recruiter@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input input-recruiter ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && (
                      <p className="error-message">{errors.email}</p>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="recruiter-password" className="form-label">
                      Password
                    </label>
                    <input
                      id="recruiter-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input input-recruiter ${errors.password ? 'input-error' : ''}`}
                    />
                    {errors.password && (
                      <p className="error-message">{errors.password}</p>
                    )}
                  </div>

                  {/* Additional Recruiter Fields */}
                  <div className="form-field">
                    <label htmlFor="company-name" className="form-label">
                      Company Name
                    </label>
                    <input
                      id="company-name"
                      name="companyName"
                      type="text"
                      placeholder="Your Company Name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="form-input input-recruiter"
                    />
                  </div>

                  <div className="flex items-center justify-between form-field">
                    <div className="checkbox-container">
                      <input
                        id="remember-recruiter"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="remember-checkbox recruiter-checkbox"
                      />
                      <label htmlFor="remember-recruiter" className="checkbox-label checkbox-label-recruiter">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="button"
                      className="forgot-password forgot-password-recruiter"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {errors.submit && (
                    <p className="error-message">{errors.submit}</p>
                  )}

                  <button 
                    type="submit"
                    className="submit-button recruiter-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="loading-text">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                        Sign in as Recruiter
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="card-footer">
            <div className="divider">
              <div className="divider-line"></div>
              <div className="divider-text">
                <span className="divider-label">New to TPO Portal?</span>
              </div>
            </div>
            
            <button 
              type="button"
              className="register-button"
              onClick={() => alert('Registration functionality would be implemented here')}
            >
              <svg className="register-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create an account
            </button>
          </div>
        </div>

        {/* Admin Access Footer */}
        <div className="admin-access">
          <button 
            type="button"
            className="admin-button"
            onClick={() => alert('Admin login would redirect to separate endpoint')}
          >
            <svg className="admin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Administrative Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
