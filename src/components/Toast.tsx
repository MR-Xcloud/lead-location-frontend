import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number; // in milliseconds, default to 3000
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg border ${getColors()} transition-all duration-300 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">{getIcon()}</div>
      <div className="text-sm font-medium flex-grow">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
        className="ml-4 p-1 rounded-full hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-opacity-50"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
