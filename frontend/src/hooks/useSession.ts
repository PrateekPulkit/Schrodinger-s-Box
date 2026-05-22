import { useState, useEffect } from 'react';

export const useSession = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Check for session in URL parameters first (allows sharing links)
    const params = new URLSearchParams(window.location.search);
    const urlSessionId = params.get('session');

    let sid: string;
    if (urlSessionId) {
      // Use session from URL (for joining existing chat)
      sid = urlSessionId;
    } else {
      // Check sessionStorage for existing session
      sid = sessionStorage.getItem('schrodinger_session') || '';
      if (!sid) {
        // Generate new session ID
        sid = 'session_' + Math.random().toString(36).substring(2, 9);
        // Update URL to reflect current session (without reloading)
        const newUrl = `${window.location.pathname}?session=${sid}`;
        window.history.replaceState({ sessionId: sid }, '', newUrl);
      }
    }
    
    sessionStorage.setItem('schrodinger_session', sid);
    setSessionId(sid);
  }, []);

  return { sessionId };
};
