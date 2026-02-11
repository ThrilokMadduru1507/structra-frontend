import Button from './Button';

function SessionWarningBar({ secondsLeft, onResume }) {
  // Calculate color based on time left
  const isUrgent = secondsLeft <= 10;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${isUrgent ? 'bg-red-600' : 'bg-yellow-500'} text-white px-4 py-3 shadow-lg`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Warning Message */}
        <div className="flex items-center gap-2">
          <span className="text-xl">⏰</span>
          <p className="font-medium">
            Your session will expire in{' '}
            <span className="font-bold">
              0:{secondsLeft.toString().padStart(2, '0')}
            </span>
          </p>
        </div>

        {/* Resume Button */}
        <Button
          variant="secondary"
          size="small"
          onClick={onResume}
        >
          Resume Session
        </Button>
      </div>
    </div>
  );
}

export default SessionWarningBar;