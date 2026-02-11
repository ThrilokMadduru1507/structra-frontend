function PageHeader({ 
  title, 
  description, 
  actions,      // Array of action buttons
  icon          // Optional icon/emoji
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        {/* Left: Title + Description */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* Optional Icon */}
            {icon && (
              <div className="text-3xl">
                {icon}
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900">
              {title}
            </h1>
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Right: Actions */}
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2 ml-4">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-colors
                  ${action.primary
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {/* Icon */}
                {action.icon && (
                  <span className="text-lg">{action.icon}</span>
                )}
                
                {/* Label */}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;