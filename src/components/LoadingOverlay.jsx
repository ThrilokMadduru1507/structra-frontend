import Spinner from './Spinner';

function LoadingOverlay({ 
  show = false,      // Whether to show the overlay
  message = 'Loading...',  // Text to display
  blur = true        // Whether to blur the background
}) {
  
  if (!show) return null;  // Don't render if not showing

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black ${blur ? 'backdrop-blur-sm' : ''} bg-opacity-50`}
      />

      {/* Loading Content */}
      <div className="relative bg-white rounded-lg shadow-2xl p-8 max-w-sm mx-4">
        <Spinner size="large" color="indigo" text={message} />
      </div>
    </div>
  );
}

export default LoadingOverlay;