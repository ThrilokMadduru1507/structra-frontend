import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';

function SessionExpiredScreen({ onResume }) {
  return (
    <AuthLayout>
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Session Expired
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-2">
          Your session has expired due to inactivity.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          For your security, we automatically log you out after a period of inactivity.
        </p>

        {/* Resume Button */}
        <Button
          variant="primary"
          fullWidth={true}
          onClick={onResume}
        >
          Return to Login
        </Button>

        {/* Info */}
        <p className="text-gray-400 text-xs mt-6">
          Your data is safe. Simply sign in again to continue.
        </p>
      </div>
    </AuthLayout>
  );
}

export default SessionExpiredScreen;