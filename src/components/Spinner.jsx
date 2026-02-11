function Spinner({ 
  size = 'medium',    // 'small', 'medium', 'large'
  color = 'indigo',   // 'indigo', 'white', 'gray'
  text              // Optional text to show below spinner
}) {
  
  // Size configurations
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Color configurations
  const colorClasses = {
    indigo: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Spinner SVG */}
      <svg 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
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

      {/* Optional Text */}
      {text && (
        <p className={`${colorClasses[color]} text-sm font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}

export default Spinner;