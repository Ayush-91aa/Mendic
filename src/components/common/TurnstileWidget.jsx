import { useEffect, useRef } from 'react';

export default function TurnstileWidget({ 
  onVerify, 
  onError, 
  sitekey = "0x4AAAAAADwamSBvqbJ-9rst", 
  action = "turnstile-spin-v1" 
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onVerifyRef = useRef(onVerify);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onErrorRef.current = onError;
  }, [onVerify, onError]);

  useEffect(() => {
    // 1. Ensure Cloudflare Turnstile script is loaded with explicit render mode
    const scriptId = 'cf-turnstile-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // 2. Render widget once window.turnstile is available
    let checkTimer;
    const renderWidget = () => {
      if (window.turnstile && containerRef.current && widgetIdRef.current === null) {
         try {
           widgetIdRef.current = window.turnstile.render(containerRef.current, {
             sitekey,
             action,
             callback: (token) => {
               if (onVerifyRef.current) onVerifyRef.current(token);
             },
             'error-callback': (err) => {
               console.error('Turnstile widget error:', err);
               if (onErrorRef.current) onErrorRef.current(err);
             },
             theme: 'dark'
           });
         } catch (e) {
           console.error('Failed to render Turnstile widget:', e);
         }
      } else if (!window.turnstile) {
        checkTimer = setTimeout(renderWidget, 100);
      }
    };

    renderWidget();

    // 3. Clean up widget when component unmounts (e.g. modal closing)
    return () => {
      if (checkTimer) clearTimeout(checkTimer);
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          console.error('Failed to remove Turnstile widget:', e);
        }
      }
    };
  }, [sitekey, action]);

  return <div ref={containerRef} className="my-3 flex justify-center" data-action={action} />;
}
