import { useEffect } from 'react';
import viewPortSize from './getViewport';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export const enableScroll = enableBodyScroll;
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
      disableBodyScroll(BODY);
    }
    console.log(width);
    return () => {
      enableBodyScroll(BODY);
    };
  }, [width, modalIsOpen]);
}
