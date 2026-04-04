import { useEffect, useRef } from 'react';

export default function usePrevious(value) {
  const previousRef = useRef();

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return previousRef.current;
}
