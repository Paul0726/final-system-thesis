// Mobile touch fix utility to prevent double-click issues
export const handleMobileClick = (callback, delay = 300) => {
  let lastClickTime = 0;
  let timeoutId = null;
  
  return (e) => {
    // Prevent default if it's a touch event
    if (e.type === 'touchstart' || e.type === 'touchend') {
      e.preventDefault();
    }
    
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    // Clear any pending timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // If clicked within delay time, ignore (prevent double-click)
    if (timeSinceLastClick < delay) {
      return;
    }
    
    lastClickTime = currentTime;
    
    // Execute callback after a small delay to ensure single click
    timeoutId = setTimeout(() => {
      callback(e);
    }, 50);
  };
};

// Fix for touch events on mobile
export const addTouchSupport = (element, callback) => {
  if (!element) return;
  
  const handleTouch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback(e);
  };
  
  element.addEventListener('touchstart', handleTouch, { passive: false });
  element.addEventListener('touchend', handleTouch, { passive: false });
  
  return () => {
    element.removeEventListener('touchstart', handleTouch);
    element.removeEventListener('touchend', handleTouch);
  };
};

