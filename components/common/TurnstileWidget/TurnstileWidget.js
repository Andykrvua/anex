import Script from 'next/script';
import { useRef, useEffect, useState } from 'react';

const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default function TurnstileWidget({ siteKey, onSuccess, onExpired, onReady, theme = 'light', size = 'normal' }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(
    () => typeof window !== 'undefined' && typeof window.turnstile !== 'undefined'
  );

  const reset = () => {
    if (widgetIdRef.current && typeof window.turnstile !== 'undefined') {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !siteKey) return;
    if (typeof window.turnstile === 'undefined') return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      size,
      callback: (token) => {
        onSuccess?.(token);
      },
      'expired-callback': () => {
        onExpired?.();
      },
    });
    onReady?.({ reset });

    return () => {
      if (widgetIdRef.current && typeof window.turnstile !== 'undefined') {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Widget may already be removed
        }
      }
    };
  }, [scriptLoaded, siteKey, theme, size]);

  if (!siteKey) return null;

  return (
    <>
      <Script src={TURNSTILE_SCRIPT} strategy="lazyOnload" onLoad={() => setScriptLoaded(true)} />
      <div ref={containerRef} className="turnstile-widget" />
    </>
  );
}
