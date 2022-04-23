import { useEffect } from 'react';
import viewPortSize from './getViewport';
// import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';

// export const enableScroll = enableBodyScroll;
export const enableScroll = unlock;
export const disableScroll = lock;
export const BODY = document.querySelector('body');
export const maxWidth = 810;

export function getWidth() {
  const { width } = viewPortSize();
  return width;
}

export function useSetBodyScroll(modalIsOpen, maxWidth) {
  const width = getWidth();

  useEffect(() => {
    if (width < maxWidth && modalIsOpen) {
      // disableBodyScroll(BODY);
      lock(BODY);
    }
    console.log(width);
    return () => {
      // enableBodyScroll(BODY);
      unlock(BODY);
      clearBodyLocks();
    };
  }, [width, modalIsOpen]);
}
