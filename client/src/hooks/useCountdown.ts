import { useState, useEffect } from 'react';

export function useCountdown(targetDate: Date | string | null, onExpire?: () => void) {
  const calculateTimeLeft = () => {
    if (!targetDate) return { minutes: 0, seconds: 0, totalSeconds: 0 };
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    if (diff <= 0) {
      return { minutes: 0, seconds: 0, totalSeconds: 0 };
    }
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds, totalSeconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining.totalSeconds <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatted = `${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;
  return { ...timeLeft, formatted };
}
