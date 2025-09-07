import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

interface LocationState {
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export const useRouteMessage = () => {
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setMessage(state.message);
      setType(state.type || 'success');
    }
  }, [location.state]);

  const clearMessage = () => {
    setMessage(null);
  };

  return {
    message,
    type,
    clearMessage
  };
};