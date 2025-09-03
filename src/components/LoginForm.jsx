import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Button,
  Input,
  Label,
  FormField,
  FormMessage,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from './ui.jsx';

const LoginForm = ({ onLogin, onBackToWelcome, defaultRole = 'student' }) => {
  const [activeTab, setActiveTab] = useState(defaultRole);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" 
         style={{ 
           background: 'var(--color-background)',
           fontFamily: 'var(--font-sans)'
         }}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 opacity-30 rounded-full blur-3xl animate-float-up"
             style={{ background: 'var(--color-primary)' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 opacity-20 rounded-full blur-3xl animate-float-down" 
             style={{ background: 'var(--color-secondary)' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 opacity-10 rounded-full blur-3xl animate-pulse" 
             style={{ background: 'var(--color-accent)' }}></div>
        
        {/* Floating Dots */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full animate-bounce" 
             style={{ backgroundColor: 'var(--color-primary)', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full animate-bounce" 
             style={{ backgroundColor: 'var(--color-secondary)', animationDelay: '3s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 rounded-full animate-bounce" 
             style={{ backgroundColor: 'var(--color-accent)', animationDelay: '5s' }}></div>
        
        {/* Additional floating elements for more fluid motion */}
        <div className="absolute top-10 right-10 w-4 h-4 rounded-full opacity-20 animate-float-up"
             style={{ backgroundColor: 'var(--color-accent)', animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-10 w-6 h-6 rounded-full opacity-15 animate-float-down"
             style={{ backgroundColor: 'var(--color-primary)', animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-white/10 animate-slide-in-down transition-all duration-300 hover:scale-105"
          onClick={onBackToWelcome}
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <svg className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Welcome
        </Button>

        <Card className="backdrop-blur-xl card-entrance hover:scale-[1.02] transition-all duration-500"
              style={{ 
                background: 'var(--color-surface-glass)', 
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-xl)',
                boxShadow: 'var(--shadow-lg)'
              }}>
          
          <CardHeader className="text-center animate-slide-in-down">
            {/* Logo/Icon */}
            <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center animate-pulse-glow hover:scale-110 transition-all duration-300"
                 style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
              <svg className="w-6 h-6 text-white transition-transform duration-300 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <CardTitle style={{ 
              fontSize: 'var(--font-size-display-sm)', 
              color: 'var(--color-text-primary)',
              fontWeight: 'var(--font-weight-bold)'
            }}>
              Welcome Back
            </CardTitle>
            
            <CardDescription style={{ 
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-base)'
            }}>
              Sign in to your TPO Portal account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 animate-fade-in-scale"
                        style={{ 
                          background: 'var(--color-surface)', 
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--border-radius-md)'
                        }}>
                <TabsTrigger value="student"
                           className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200"
                           style={{ 
                             color: 'var(--color-text-secondary)',
                             transition: 'var(--transition-base)'
                           }}>
                  <svg className="w-4 h-4 mr-2 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Student
                </TabsTrigger>
                <TabsTrigger value="recruiter"
                           className="data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200"
                           style={{ 
                             color: 'var(--color-text-secondary)',
                             transition: 'var(--transition-base)'
                           }}>
                  <svg className="w-4 h-4 mr-2 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Recruiter
                </TabsTrigger>
              </TabsList>

              {/* Student Login Form */}
              <TabsContent value="student" className="tab-content-enter">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField className="form-field-stagger">
                    <Label htmlFor="student-email" 
                           style={{ 
                             color: 'var(--color-text-primary)', 
                             fontSize: 'var(--font-size-sm)',
                             fontWeight: 'var(--font-weight-medium)'
                           }}>
                      Student Email
                    </Label>
                    <div className="input-focus-animation">
                      <Input
                        id="student-email"
                        name="email"
                        type="email"
                        placeholder="john.doe@university.edu"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${errors.email ? 'border-red-500' : ''} hover:border-blue-400 focus:scale-[1.02] transition-all duration-300`}
                        style={{
                          background: 'var(--color-surface)',
                          border: `1px solid ${errors.email ? 'var(--color-error)' : 'var(--color-border)'}`,
                          color: 'var(--color-text-primary)',
                          borderRadius: 'var(--border-radius-md)',
                          transition: 'var(--transition-base)'
                        }}
                      />
                    </div>
                    {errors.email && (
                      <FormMessage variant="error" 
                                   className="animate-slide-in-up" 
                                   style={{ color: 'var(--color-error)' }}>
                        {errors.email}
                      </FormMessage>
                    )}
                  </FormField>

                  <FormField className="form-field-stagger">
                    <Label htmlFor="student-password"
                           style={{ 
                             color: 'var(--color-text-primary)', 
                             fontSize: 'var(--font-size-sm)',
                             fontWeight: 'var(--font-weight-medium)'
                           }}>
                      Password
                    </Label>
                    <div className="input-focus-animation">
                      <Input
                        id="student-password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`${errors.password ? 'border-red-500' : ''} hover:border-blue-400 focus:scale-[1.02] transition-all duration-300`}
                        style={{
                          background: 'var(--color-surface)',
                          border: `1px solid ${errors.password ? 'var(--color-error)' : 'var(--color-border)'}`,
                          color: 'var(--color-text-primary)',
                          borderRadius: 'var(--border-radius-md)',
                          transition: 'var(--transition-base)'
                        }}
                      />
                    </div>
                    {errors.password && (
                      <FormMessage variant="error" 
                                   className="animate-slide-in-up" 
                                   style={{ color: 'var(--color-error)' }}>
                        {errors.password}
                      </FormMessage>
                    )}
                  </FormField>

                  <div className="flex items-center justify-between form-field-stagger"
                       style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember-student"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:scale-110"
                        style={{ 
                          accentColor: 'var(--color-primary)',
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)'
                        }}
                      />
                      <Label htmlFor="remember-student" 
                             className="hover:text-blue-400 transition-colors duration-200"
                             style={{ 
                               fontSize: 'var(--font-size-sm)', 
                               color: 'var(--color-text-secondary)' 
                             }}>
                        Remember me
                      </Label>
                    </div>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-sm p-0 h-auto hover:underline hover:scale-105 transition-all duration-200"
                      onClick={handleForgotPassword}
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  {errors.submit && (
                    <FormMessage variant="error" 
                                 className="animate-slide-in-up" 
                                 style={{ color: 'var(--color-error)' }}>
                      {errors.submit}
                    </FormMessage>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full btn-gradient-hover form-field-stagger group"
                    disabled={isLoading}
                    style={{
                      background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))`,
                      border: 'none',
                      borderRadius: 'var(--border-radius-md)',
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      fontSize: 'var(--font-size-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      transition: 'var(--transition-base)',
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="loading-shimmer">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Sign in as Student
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Recruiter Login Form */}
              <TabsContent value="recruiter" className="tab-content-enter">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField className="form-field-stagger">
                    <Label htmlFor="recruiter-email"
                           style={{ 
                             color: 'var(--color-text-primary)', 
                             fontSize: 'var(--font-size-sm)',
                             fontWeight: 'var(--font-weight-medium)'
                           }}>
                      Company Email
                    </Label>
                    <div className="input-focus-animation">
                      <Input
                        id="recruiter-email"
                        name="email"
                        type="email"
                        placeholder="recruiter@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${errors.email ? 'border-red-500' : ''} hover:border-purple-400 focus:scale-[1.02] transition-all duration-300`}
                        style={{
                          background: 'var(--color-surface)',
                          border: `1px solid ${errors.email ? 'var(--color-error)' : 'var(--color-border)'}`,
                          color: 'var(--color-text-primary)',
                          borderRadius: 'var(--border-radius-md)',
                          transition: 'var(--transition-base)'
                        }}
                      />
                    </div>
                    {errors.email && (
                      <FormMessage variant="error" 
                                   className="animate-slide-in-up" 
                                   style={{ color: 'var(--color-error)' }}>
                        {errors.email}
                      </FormMessage>
                    )}
                  </FormField>

                  <FormField className="form-field-stagger">
                    <Label htmlFor="recruiter-password"
                           style={{ 
                             color: 'var(--color-text-primary)', 
                             fontSize: 'var(--font-size-sm)',
                             fontWeight: 'var(--font-weight-medium)'
                           }}>
                      Password
                    </Label>
                    <div className="input-focus-animation">
                      <Input
                        id="recruiter-password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`${errors.password ? 'border-red-500' : ''} hover:border-purple-400 focus:scale-[1.02] transition-all duration-300`}
                        style={{
                          background: 'var(--color-surface)',
                          border: `1px solid ${errors.password ? 'var(--color-error)' : 'var(--color-border)'}`,
                          color: 'var(--color-text-primary)',
                          borderRadius: 'var(--border-radius-md)',
                          transition: 'var(--transition-base)'
                        }}
                      />
                    </div>
                    {errors.password && (
                      <FormMessage variant="error" 
                                   className="animate-slide-in-up" 
                                   style={{ color: 'var(--color-error)' }}>
                        {errors.password}
                      </FormMessage>
                    )}
                  </FormField>

                  {/* Additional Recruiter Fields */}
                  <FormField className="form-field-stagger">
                    <Label htmlFor="company-name"
                           style={{ 
                             color: 'var(--color-text-primary)', 
                             fontSize: 'var(--font-size-sm)',
                             fontWeight: 'var(--font-weight-medium)'
                           }}>
                      Company Name
                    </Label>
                    <div className="input-focus-animation">
                      <Input
                        id="company-name"
                        name="companyName"
                        type="text"
                        placeholder="Your Company Name"
                        className="hover:border-purple-400 focus:scale-[1.02] transition-all duration-300"
                        style={{
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          borderRadius: 'var(--border-radius-md)',
                          transition: 'var(--transition-base)'
                        }}
                      />
                    </div>
                  </FormField>

                  <div className="flex items-center justify-between form-field-stagger"
                       style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember-recruiter"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:scale-110"
                        style={{ 
                          accentColor: 'var(--color-secondary)',
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)'
                        }}
                      />
                      <Label htmlFor="remember-recruiter" 
                             className="hover:text-purple-400 transition-colors duration-200"
                             style={{ 
                               fontSize: 'var(--font-size-sm)', 
                               color: 'var(--color-text-secondary)' 
                             }}>
                        Remember me
                      </Label>
                    </div>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-sm p-0 h-auto hover:underline hover:scale-105 transition-all duration-200"
                      onClick={handleForgotPassword}
                      style={{ color: 'var(--color-secondary)' }}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  {errors.submit && (
                    <FormMessage variant="error" 
                                 className="animate-slide-in-up" 
                                 style={{ color: 'var(--color-error)' }}>
                      {errors.submit}
                    </FormMessage>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full btn-gradient-hover form-field-stagger group"
                    disabled={isLoading}
                    style={{
                      background: `linear-gradient(135deg, var(--color-secondary), #7c3aed)`,
                      border: 'none',
                      borderRadius: 'var(--border-radius-md)',
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      fontSize: 'var(--font-size-base)',
                      fontWeight: 'var(--font-weight-medium)',
                      transition: 'var(--transition-base)',
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="loading-shimmer">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                        Sign in as Recruiter
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 animate-slide-in-up">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t transition-colors duration-300" style={{ borderColor: 'var(--color-border)' }} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2" 
                      style={{ 
                        backgroundColor: 'var(--color-surface-glass)', 
                        color: 'var(--color-text-muted)',
                        fontSize: 'var(--font-size-xs)'
                      }}>
                  New to TPO Portal?
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full btn-gradient-hover hover:border-blue-400 hover:scale-[1.02] transition-all duration-300 group"
              onClick={() => alert('Registration functionality would be implemented here')}
              style={{
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-primary)',
                borderRadius: 'var(--border-radius-md)',
                transition: 'var(--transition-base)'
              }}
            >
              <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create an account
            </Button>
          </CardFooter>
        </Card>

        {/* Admin Access Footer */}
        <div className="mt-6 text-center animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
          <Button 
            variant="link" 
            className="text-sm hover:underline hover:scale-105 transition-all duration-300 group"
            onClick={() => alert('Admin login would redirect to separate endpoint')}
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Administrative Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
