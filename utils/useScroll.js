import { useState, useEffect } from 'react';
import { isBrowser } from 'utils/utils';

export default function useScroll() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollPosition(window.pageYOffset);
    }
    if (isBrowser()) {
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return scrollPosition;
}
