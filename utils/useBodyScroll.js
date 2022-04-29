import { useEffect } from 'react';
import viewPortSize from './getViewport';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';

// export const enableScroll = enableBodyScroll;
export const enableScroll = unlock;
export const disableScroll = lock;
export const clear = clearBodyLocks;
export const BODY = document.querySelector('body');
export const maxWidth = 810;

export function getSize() {
  const size = viewPortSize();
  return size;
}

export function useSetBodyScroll(modalIsOpen, maxWidth, width) {
  // const width = getWidth();

  useEffect(() => {
    if (width < maxWidth && modalIsOpen) {
      lock(BODY);
      BODY.classList.add('iosfix');
    }

    return () => {
      unlock(BODY);
      BODY.classList.remove('iosfix');
      clearBodyLocks();
    };
  }, [width, modalIsOpen]);
}
