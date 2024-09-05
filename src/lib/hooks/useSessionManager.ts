import { useEffect } from 'react';
import { getSession, setSession } from '../utils';

export function useSessionManager(onNewSession: () => void) {
  useEffect(() => {
    const session = getSession();
    if (!session) {
      setSession(crypto.randomUUID());
      onNewSession(); 
    }
  }, [onNewSession]);
}
