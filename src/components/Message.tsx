import { useEffect, useState } from 'react';

interface MessageProps {
  message?: string | null;
  type?: 'success' | 'error' | 'info' | 'warning';
  onDismiss?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const Message = ({ 
  message, 
  type = 'success', 
  onDismiss,
  autoClose = true,
  autoCloseDelay = 5000 
}: MessageProps) => {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    setIsVisible(!!message);
  }, [message]);

  useEffect(() => {
    if (message && autoClose) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [message, autoClose, autoCloseDelay]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getAlertClass = () => {
    switch (type) {
      case 'error': return 'alert-danger';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      case 'success':
      default: return 'alert-success';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error': return 'bi-exclamation-triangle-fill';
      case 'warning': return 'bi-exclamation-circle-fill';
      case 'info': return 'bi-info-circle-fill';
      case 'success':
      default: return 'bi-check-circle-fill';
    }
  };

  if (!message || !isVisible) return null;

  return (
    <div className={`alert ${getAlertClass()} alert-dismissible fade show mb-3`} role="alert">
      <i className={`bi ${getIcon()} me-2`}></i>
      {message}
      <button 
        type="button" 
        className="btn-close" 
        onClick={handleDismiss}
        aria-label="Close"
      ></button>
    </div>
  );
};