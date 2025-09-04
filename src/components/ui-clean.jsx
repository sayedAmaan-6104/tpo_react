import React from 'react';

// Loading Spinner Component
export const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

// Modal Component
export const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
    <div 
      className="rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border"
      style={{ 
        backgroundColor: 'var(--color-surface-glass)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h2>
        <button 
          onClick={onClose} 
          className="text-3xl hover:opacity-70 transition-opacity"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          &times;
        </button>
      </div>
      {children}
    </div>
  </div>
);

// Card Component
export const Card = ({ children, className = '' }) => (
  <div 
    className={`rounded-2xl shadow-lg p-6 border ${className}`}
    style={{ 
      backgroundColor: 'var(--color-surface-glass)',
      backdropFilter: 'blur(16px)',
      borderColor: 'var(--color-border)'
    }}
  >
    {children}
  </div>
);

// Button Component
export const Button = ({ 
  onClick, 
  children, 
  className = '', 
  type = "button", 
  disabled = false,
  variant = 'primary'
}) => {
  const baseClasses = "px-6 py-3 font-bold rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-400",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 focus:ring-purple-400",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-400",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 focus:ring-red-400",
    outline: "border-2 bg-transparent hover:bg-opacity-10 transition-colors"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={variant === 'outline' ? {
        borderColor: 'var(--color-primary)',
        color: 'var(--color-primary)'
      } : {}}
    >
      {children}
    </button>
  );
};

// Icon Wrapper Component
export const IconWrapper = ({ children, className = '' }) => (
  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${className}`}>
    {children}
  </div>
);

// Input component with variables.css integration
export const Input = React.forwardRef(({ className = '', type = 'text', label, error, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label 
          className="block text-sm font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          flex h-10 w-full px-3 py-2 text-sm 
          file:border-0 file:bg-transparent file:text-sm file:font-medium 
          placeholder:opacity-60 focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
          disabled:opacity-50 transition-all
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        ref={ref}
        style={{
          background: 'var(--color-surface)',
          border: `1px solid ${error ? '#ef4444' : 'var(--color-border)'}`,
          borderRadius: 'var(--border-radius-md)',
          color: 'var(--color-text-primary)',
          transition: 'var(--transition-base)',
          fontSize: 'var(--font-size-base)'
        }}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
