import React, { useState, useEffect } from 'react';
import './RegistrationForm.css';

const RegistrationForm = ({ onRegister, onBackToWelcome, onGoToLogin, defaultRole = 'student' }) => {
  const [activeTab, setActiveTab] = useState(defaultRole);
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Student specific fields
    studentId: '',
    university: '',
    department: '',
    graduationYear: '',
    
    // Recruiter specific fields
    companyName: '',
    position: '',
    companyWebsite: '',
    companySize: '',
    
    // Agreements
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeNewsletter: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Update activeTab when defaultRole changes
  useEffect(() => {
    setActiveTab(defaultRole);
    // Reset form data when switching tabs
    setFormData(prev => ({
      ...prev,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      studentId: '',
      university: '',
      department: '',
      graduationYear: '',
      companyName: '',
      position: '',
      companyWebsite: '',
      companySize: '',
      agreeToTerms: false,
      agreeToPrivacy: false,
      subscribeNewsletter: false
    }));
    setErrors({});
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
    
    // Common validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Role-specific validations
    if (activeTab === 'student') {
      if (!formData.studentId.trim()) {
        newErrors.studentId = 'Student ID is required';
      }
      if (!formData.university.trim()) {
        newErrors.university = 'University is required';
      }
      if (!formData.department.trim()) {
        newErrors.department = 'Department is required';
      }
      if (!formData.graduationYear) {
        newErrors.graduationYear = 'Graduation year is required';
      }
    } else if (activeTab === 'recruiter') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.position.trim()) {
        newErrors.position = 'Your position is required';
      }
      if (!formData.companyWebsite.trim()) {
        newErrors.companyWebsite = 'Company website is required';
      } else if (!/^https?:\/\/.+/.test(formData.companyWebsite)) {
        newErrors.companyWebsite = 'Please enter a valid website URL';
      }
      if (!formData.companySize) {
        newErrors.companySize = 'Company size is required';
      }
    }
    
    // Agreement validations
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the onRegister callback with the form data
      onRegister(activeTab, formData);
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // Reset form errors when switching tabs
    setErrors({});
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({length: 6}, (_, i) => currentYear + i);

  return (
    <div className="registration-container">
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

        <div className="registration-card">
          <div className="card-header">
            {/* Logo/Icon */}
            <div className="logo-container">
              <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            
            <h2 className="card-title">Join TPO Portal</h2>
            <p className="card-description">Create your account to get started</p>
          </div>

          <div className="card-content">
            <div className="tabs">
              <div className="tabs-list">
                <button 
                  type="button"
                  className="tab-trigger"
                  data-active={activeTab === 'student'}
                  data-role="student"
                  onClick={() => handleTabChange('student')}
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
                  onClick={() => handleTabChange('recruiter')}
                >
                  <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Recruiter
                </button>
              </div>

              <form onSubmit={handleSubmit} className="registration-form">
                {/* Common Fields */}
                <div className="form-row">
                  <div className="form-field half-width">
                    <label htmlFor="firstName" className="form-label">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="error-message">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="form-field half-width">
                    <label htmlFor="lastName" className="form-label">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="error-message">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={activeTab === 'student' ? 'john.doe@university.edu' : 'john.doe@company.com'}
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${activeTab === 'recruiter' ? 'input-recruiter' : ''} ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email}</p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-field half-width">
                    <label htmlFor="password" className="form-label">
                      Password *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${activeTab === 'recruiter' ? 'input-recruiter' : ''} ${errors.password ? 'input-error' : ''}`}
                    />
                    {errors.password && (
                      <p className="error-message">{errors.password}</p>
                    )}
                  </div>

                  <div className="form-field half-width">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-input ${activeTab === 'recruiter' ? 'input-recruiter' : ''} ${errors.confirmPassword ? 'input-error' : ''}`}
                    />
                    {errors.confirmPassword && (
                      <p className="error-message">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="phone" className="form-label">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${activeTab === 'recruiter' ? 'input-recruiter' : ''} ${errors.phone ? 'input-error' : ''}`}
                  />
                  {errors.phone && (
                    <p className="error-message">{errors.phone}</p>
                  )}
                </div>

                {/* Student-specific fields */}
                {activeTab === 'student' && (
                  <>
                    <div className="form-row">
                      <div className="form-field half-width">
                        <label htmlFor="studentId" className="form-label">
                          Student ID *
                        </label>
                        <input
                          id="studentId"
                          name="studentId"
                          type="text"
                          placeholder="S123456789"
                          value={formData.studentId}
                          onChange={handleInputChange}
                          className={`form-input ${errors.studentId ? 'input-error' : ''}`}
                        />
                        {errors.studentId && (
                          <p className="error-message">{errors.studentId}</p>
                        )}
                      </div>

                      <div className="form-field half-width">
                        <label htmlFor="graduationYear" className="form-label">
                          Graduation Year *
                        </label>
                        <select
                          id="graduationYear"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleInputChange}
                          className={`form-input form-select ${errors.graduationYear ? 'input-error' : ''}`}
                        >
                          <option value="">Select year</option>
                          {graduationYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.graduationYear && (
                          <p className="error-message">{errors.graduationYear}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="university" className="form-label">
                        University *
                      </label>
                      <input
                        id="university"
                        name="university"
                        type="text"
                        placeholder="University Name"
                        value={formData.university}
                        onChange={handleInputChange}
                        className={`form-input ${errors.university ? 'input-error' : ''}`}
                      />
                      {errors.university && (
                        <p className="error-message">{errors.university}</p>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="department" className="form-label">
                        Department/Major *
                      </label>
                      <input
                        id="department"
                        name="department"
                        type="text"
                        placeholder="Computer Science, Engineering, etc."
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`form-input ${errors.department ? 'input-error' : ''}`}
                      />
                      {errors.department && (
                        <p className="error-message">{errors.department}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Recruiter-specific fields */}
                {activeTab === 'recruiter' && (
                  <>
                    <div className="form-row">
                      <div className="form-field half-width">
                        <label htmlFor="companyName" className="form-label">
                          Company Name *
                        </label>
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          placeholder="Tech Corp Inc."
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`form-input input-recruiter ${errors.companyName ? 'input-error' : ''}`}
                        />
                        {errors.companyName && (
                          <p className="error-message">{errors.companyName}</p>
                        )}
                      </div>

                      <div className="form-field half-width">
                        <label htmlFor="position" className="form-label">
                          Your Position *
                        </label>
                        <input
                          id="position"
                          name="position"
                          type="text"
                          placeholder="HR Manager, Talent Acquisition"
                          value={formData.position}
                          onChange={handleInputChange}
                          className={`form-input input-recruiter ${errors.position ? 'input-error' : ''}`}
                        />
                        {errors.position && (
                          <p className="error-message">{errors.position}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-field half-width">
                        <label htmlFor="companyWebsite" className="form-label">
                          Company Website *
                        </label>
                        <input
                          id="companyWebsite"
                          name="companyWebsite"
                          type="url"
                          placeholder="https://company.com"
                          value={formData.companyWebsite}
                          onChange={handleInputChange}
                          className={`form-input input-recruiter ${errors.companyWebsite ? 'input-error' : ''}`}
                        />
                        {errors.companyWebsite && (
                          <p className="error-message">{errors.companyWebsite}</p>
                        )}
                      </div>

                      <div className="form-field half-width">
                        <label htmlFor="companySize" className="form-label">
                          Company Size *
                        </label>
                        <select
                          id="companySize"
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleInputChange}
                          className={`form-input form-select input-recruiter ${errors.companySize ? 'input-error' : ''}`}
                        >
                          <option value="">Select size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                        {errors.companySize && (
                          <p className="error-message">{errors.companySize}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Agreements */}
                <div className="agreements-section">
                  <div className="checkbox-container">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className={`agreement-checkbox ${activeTab === 'recruiter' ? 'recruiter-checkbox' : ''}`}
                    />
                    <label htmlFor="agreeToTerms" className={`checkbox-label ${activeTab === 'recruiter' ? 'checkbox-label-recruiter' : ''}`}>
                      I agree to the <button type="button" className="link-button">Terms and Conditions</button> *
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="error-message">{errors.agreeToTerms}</p>
                  )}

                  <div className="checkbox-container">
                    <input
                      id="agreeToPrivacy"
                      name="agreeToPrivacy"
                      type="checkbox"
                      checked={formData.agreeToPrivacy}
                      onChange={handleInputChange}
                      className={`agreement-checkbox ${activeTab === 'recruiter' ? 'recruiter-checkbox' : ''}`}
                    />
                    <label htmlFor="agreeToPrivacy" className={`checkbox-label ${activeTab === 'recruiter' ? 'checkbox-label-recruiter' : ''}`}>
                      I agree to the <button type="button" className="link-button">Privacy Policy</button> *
                    </label>
                  </div>
                  {errors.agreeToPrivacy && (
                    <p className="error-message">{errors.agreeToPrivacy}</p>
                  )}

                  <div className="checkbox-container">
                    <input
                      id="subscribeNewsletter"
                      name="subscribeNewsletter"
                      type="checkbox"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      className={`agreement-checkbox ${activeTab === 'recruiter' ? 'recruiter-checkbox' : ''}`}
                    />
                    <label htmlFor="subscribeNewsletter" className={`checkbox-label ${activeTab === 'recruiter' ? 'checkbox-label-recruiter' : ''}`}>
                      Subscribe to newsletter for updates and opportunities
                    </label>
                  </div>
                </div>

                {errors.submit && (
                  <p className="error-message">{errors.submit}</p>
                )}

                <button 
                  type="submit"
                  className={`submit-button ${activeTab === 'student' ? 'student-button' : 'recruiter-button'}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="loading-text">Creating account...</span>
                    </>
                  ) : (
                    <>
                      <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Create {activeTab === 'student' ? 'Student' : 'Recruiter'} Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="card-footer">
            <div className="divider">
              <div className="divider-line"></div>
              <div className="divider-text">
                <span className="divider-label">Already have an account?</span>
              </div>
            </div>
            
            <button 
              type="button"
              className="login-button"
              onClick={onGoToLogin || (() => alert('Login functionality would be implemented here'))}
            >
              <svg className="login-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign in to your account
            </button>
          </div>
        </div>

        {/* Admin Access Footer */}
        <div className="admin-access">
          <button 
            type="button"
            className="admin-button"
            onClick={() => alert('Admin portal would redirect to separate endpoint')}
          >
            <svg className="admin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Administrative Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
