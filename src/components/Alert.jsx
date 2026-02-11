function Alert({ 
  type = 'info',      // 'success', 'error', 'warning', 'info'
  title,              // Main message (bold)
  message,            // Optional detailed message
  onClose,            // Function to call when X is clicked
  dismissible = true  // Whether to show X button
}) {
  
  // Styles for each alert type
  const typeStyles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: '✅',
      iconColor: 'text-green-600'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: '⚠️',
      iconColor: 'text-red-600'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: '⚡',
      iconColor: 'text-yellow-600'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'ℹ️',
      iconColor: 'text-blue-600'
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <div className={`border rounded-lg p-4 ${currentStyle.container} relative`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className={`text-xl ${currentStyle.iconColor}`}>
          {currentStyle.icon}
        </span>

        {/* Content */}
        <div className="flex-1">
          {/* Title */}
          {title && (
            <p className="font-semibold mb-1">
              {title}
            </p>
          )}
          
          {/* Message */}
          {message && (
            <p className="text-sm">
              {message}
            </p>
          )}
        </div>

        {/* Close Button */}
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;