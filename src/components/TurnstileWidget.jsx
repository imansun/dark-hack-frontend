import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

const TurnstileWidget = forwardRef(function TurnstileWidget({ }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [ready, setReady] = useState(false);

  useImperativeHandle(ref, () => ({
    execute: () => new Promise((resolve) => {
      if (!window.turnstile || widgetIdRef.current == null) {
        resolve(null);
        return;
      }
      window.turnstile.execute(widgetIdRef.current, {
        callback: (token) => resolve(token),
      });
    }),
    reset: () => {
      if (window.turnstile && widgetIdRef.current != null) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    if (window.turnstile) { setReady(true); return; }
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.defer = true;
    s.onload = () => setReady(true);
    document.body.appendChild(s);
    return () => { if (s.parentNode) s.parentNode.removeChild(s); };
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    if (widgetIdRef.current != null) {
      window.turnstile.remove(widgetIdRef.current);
    }
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
    });
    return () => {
      if (widgetIdRef.current != null) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [ready]);

  return <div ref={containerRef} />;
});

export default TurnstileWidget;
