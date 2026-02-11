function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Area */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">
            Structra Studio
          </h1>
          <p className="text-gray-600">
            Data Transformation Design Platform
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 Structra Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;