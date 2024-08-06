import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-XE21KF1MQR', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);
};

