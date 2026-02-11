import { useState } from 'react';
import AuthLayout from './layouts/AuthLayout';
import Button from './components/Button';
import Spinner from './components/Spinner';
import LoadingOverlay from './components/LoadingOverlay';
import Skeleton from './components/Skeleton';

function LoadingDemo() {
  const [showOverlay, setShowOverlay] = useState(false);

  const triggerOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Loading Components Demo
        </h2>

        {/* Spinner Examples */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Spinners:</h3>
          
          <div className="flex items-center gap-8 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Spinner size="small" color="indigo" />
              <p className="text-xs text-gray-600 mt-2">Small</p>
            </div>
            
            <div className="text-center">
              <Spinner size="medium" color="indigo" />
              <p className="text-xs text-gray-600 mt-2">Medium</p>
            </div>
            
            <div className="text-center">
              <Spinner size="large" color="indigo" />
              <p className="text-xs text-gray-600 mt-2">Large</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-600 rounded-lg">
            <Spinner size="medium" color="white" text="Loading data..." />
          </div>
        </div>

        {/* Loading Overlay Example */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Loading Overlay:</h3>
          
          <Button onClick={triggerOverlay}>
            Show Loading Overlay (3 seconds)
          </Button>

          <LoadingOverlay 
            show={showOverlay} 
            message="Processing your request..."
          />
        </div>

        {/* Skeleton Examples */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Skeleton Loaders:</h3>
          
          <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
            {/* Title skeleton */}
            <Skeleton variant="title" width="60%" />
            
            {/* Text skeletons */}
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="80%" />
            
            {/* Circle + text (like user profile) */}
            <div className="flex items-center gap-3 mt-4">
              <Skeleton variant="circle" width="48px" height="48px" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="120px" />
                <Skeleton variant="text" width="80px" />
              </div>
            </div>

            {/* Rectangle (like image placeholder) */}
            <Skeleton variant="rectangle" width="100%" height="200px" className="mt-4" />
          </div>
        </div>

        {/* Complete Message */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-semibold">
            ✅ Session 6 Complete!
          </p>
          <p className="text-green-600 text-sm mt-1">
            All loading components are working!
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default LoadingDemo;