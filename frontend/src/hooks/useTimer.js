import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(timeLimit, onExpire) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newTime) => {
    clearInterval(intervalRef.current);
    setTimeRemaining(newTime ?? timeLimit);
    setIsRunning(true);
  }, [timeLimit]);

  return { timeRemaining, isExpired: timeRemaining <= 0, isRunning, start, pause, reset };
}
