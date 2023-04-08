import { useState, useEffect } from 'react';

// Debounce function
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function getSize() {
  return {
    width: window?.innerWidth,
    height: window?.innerHeight,
  };
}

export default function useWindowSize() {
  if (typeof window !== 'undefined') {
    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
      var handleResizeDebounced = debounce(function handleResize() {
        setWindowSize(getSize());
      }, 100);

      window.addEventListener('resize', handleResizeDebounced);
      // Debounce to avoid the function fire multiple times
      return () => window.removeEventListener('resize', handleResizeDebounced);
    }, []);
    return windowSize;
  }
}
