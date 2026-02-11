function Button({
  children,           // Text or content inside the button
  onClick,            // Function to call when clicked
  variant = 'primary', // 'primary', 'secondary', 'danger'
  size = 'medium',    // 'small', 'medium', 'large'
  disabled = false,   // Whether button is disabled
  loading = false,    // Whether to show loading spinner
  fullWidth = false,  // Whether button takes full width
  type = 'button'     // 'button', 'submit', 'reset'
}) {
  
  // Base styles that apply to all buttons
  const baseStyles = `
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  `;

  // Variant styles (colors)
  const variantStyles = {
    primary: `
      bg-indigo-600 text-white
      hover:bg-indigo-700
      focus:ring-indigo-500
      disabled:hover:bg-indigo-600
    `,
    secondary: `
      bg-gray-200 text-gray-800
      hover:bg-gray-300
      focus:ring-gray-400
      disabled:hover:bg-gray-200
    `,
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  // Size styles (padding and text size)
  const sizeStyles = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg'
  };

  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyle}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg 
          className="animate-spin h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Button Text */}
      <span>{children}</span>
    </button>
  );
}

export default Button;