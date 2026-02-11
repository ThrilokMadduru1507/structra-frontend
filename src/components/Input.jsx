function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder,
  disabled = false 
}) {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Input Field */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-lg border
          transition-all duration-200
          focus:outline-none focus:ring-2
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
          }
          ${disabled 
            ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
            : 'bg-white text-gray-900'
          }
        `}
      />

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default Input;