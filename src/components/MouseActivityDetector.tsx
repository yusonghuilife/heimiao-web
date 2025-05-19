import { useEffect, useState } from 'react';
import { isMobileDevice } from '../utils';

const INACTIVITY_TIMEOUT = 10000; // 3 seconds of inactivity before changing opacity

export const useMouseActivity = () => {
  if (isMobileDevice()) {
    return true;
  }
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseActivity = () => {
      setIsActive(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsActive(false);
      }, INACTIVITY_TIMEOUT);
    };

    // Add event listeners for mouse movement and clicks
    document.addEventListener('mousemove', handleMouseActivity);
    document.addEventListener('mousedown', handleMouseActivity);
    document.addEventListener('keydown', handleMouseActivity);

    // Initial setup
    handleMouseActivity();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousemove', handleMouseActivity);
      document.removeEventListener('mousedown', handleMouseActivity);
      document.removeEventListener('keydown', handleMouseActivity);
    };
  }, []);

  return isActive;
}; 