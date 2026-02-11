import { useState, useEffect, useCallback, useRef } from 'react';

// Configuration (in milliseconds)
const SESSION_TIMEOUT = 5 * 60 * 1000;    // 5 minutes
const WARNING_TIME = 30 * 1000;            // Warning 30 seconds before
const WARNING_THRESHOLD = SESSION_TIMEOUT - WARNING_TIME;

function useSessionTimeout(isAuthenticated, onTimeout) {
  // Track session state
  const [timeoutState, setTimeoutState] = useState({
    showWarning: false,
    secondsLeft: 30
  });

  // Use refs instead of putting functions in dependencies
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const onTimeoutRef = useRef(onTimeout);

  // Update the ref when onTimeout changes
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Reset the timeout timer
  const resetTimer = useCallback(() => {
    // Only run if user is logged in
    if (!isAuthenticated) return;


    // Clear any existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Hide warning if showing
    setTimeoutState({ showWarning: false, secondsLeft: 10 });

    // Start warning timer
    timerRef.current = setTimeout(() => {

      // Start showing warning
      setTimeoutState({ showWarning: true, secondsLeft: 10 });

      // Start countdown
      let count = 10;
      countdownRef.current = setInterval(() => {
        count -= 1;

        setTimeoutState({ showWarning: true, secondsLeft: count });

        // If countdown reaches 0, trigger timeout
        if (count <= 0) {
          clearInterval(countdownRef.current);
          onTimeoutRef.current();
        }
      }, 1000);

    }, WARNING_THRESHOLD);

  }, [isAuthenticated]); // Only depends on isAuthenticated now

  // Listen for user activity
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timers if logged out
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      return;
    }

    // Reset timer on these events
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Start the initial timer
    resetTimer();

    // Cleanup when component unmounts or user logs out
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isAuthenticated, resetTimer]);

  return {
    showWarning: timeoutState.showWarning,
    secondsLeft: timeoutState.secondsLeft,
    resetTimer
  };
}

export default useSessionTimeout;