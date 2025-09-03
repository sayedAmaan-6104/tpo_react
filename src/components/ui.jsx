import React from 'react';

// Input component with variables.css integration
export const Input = React.forwardRef(({ className = '', type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={`
        flex h-10 w-full px-3 py-2 text-sm 
        file:border-0 file:bg-transparent file:text-sm file:font-medium 
        placeholder:opacity-60 focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
        disabled:opacity-50 transition-all
        ${className}
      `}
      ref={ref}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-md)',
        color: 'var(--color-text-primary)',
        transition: 'var(--transition-base)',
        fontSize: 'var(--font-size-base)'
      }}
      {...props}
    />
  );
});

// Label component
export const Label = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`
        text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
        peer-disabled:opacity-70 text-gray-700 dark:text-gray-300
        ${className}
      `}
      {...props}
    />
  );
});

// Form component
export const Form = ({ children, ...props }) => {
  return <form {...props}>{children}</form>;
};

export const FormField = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};

export const FormMessage = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'text-gray-600 dark:text-gray-400',
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400'
  };

  return (
    <p className={`text-sm ${variants[variant]}`}>
      {children}
    </p>
  );
};

// Card components with variables.css integration
export const Card = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`transition-all ${className}`}
      style={{
        background: 'var(--color-surface-glass)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(20px)',
        transition: 'var(--transition-base)'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div className={`flex flex-col ${className}`} 
         style={{ padding: 'var(--spacing-6)', paddingBottom: '0' }} 
         {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3
      className={`leading-none tracking-tight ${className}`}
      style={{
        fontSize: 'var(--font-size-display-sm)',
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--spacing-2)'
      }}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ className = '', children, ...props }) => {
  return (
    <p className={`${className}`} 
       style={{
         fontSize: 'var(--font-size-base)',
         color: 'var(--color-text-secondary)',
         lineHeight: 'var(--line-height-relaxed)'
       }}
       {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div className={`${className}`} 
         style={{ padding: 'var(--spacing-6)', paddingTop: '0' }} 
         {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className = '', children, ...props }) => {
  return (
    <div className={`flex items-center ${className}`} 
         style={{ padding: 'var(--spacing-6)', paddingTop: '0' }} 
         {...props}>
      {children}
    </div>
  );
};

// Button component (enhanced version)
export const Button = React.forwardRef(({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center rounded-md text-sm font-medium 
    ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none 
    disabled:opacity-50 dark:ring-offset-gray-900 dark:focus-visible:ring-blue-400
  `;

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    link: 'text-blue-600 underline-offset-4 hover:underline dark:text-blue-400'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

// Tabs components
export const Tabs = ({ children, defaultValue, value, onValueChange, className = '' }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || value);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={className} data-active-tab={activeTab}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, onTabChange: handleTabChange })
      )}
    </div>
  );
};

export const TabsList = ({ children, className = '', activeTab, onTabChange }) => {
  return (
    <div
      className={`
        inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 
        text-gray-500 dark:bg-gray-800 dark:text-gray-400
        ${className}
      `}
    >
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, onTabChange })
      )}
    </div>
  );
};

export const TabsTrigger = ({ children, value, className = '', activeTab, onTabChange }) => {
  const isActive = activeTab === value;
  
  return (
    <button
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 
        text-sm font-medium ring-offset-white transition-all focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50 
        ${isActive 
          ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50' 
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }
        ${className}
      `}
      onClick={() => onTabChange?.(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value, className = '', activeTab }) => {
  if (activeTab !== value) return null;
  
  return (
    <div
      className={`
        mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${className}
      `}
    >
      {children}
    </div>
  );
};
