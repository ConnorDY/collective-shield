import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../utilities';

const ScrollToTop: React.FC<{ children: any }> = ({ children }) => {
  const location = useLocation();
  const prevLocation = useRef({});

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      scrollToTop();
      prevLocation.current = location.pathname;
    }
  }, [location]);

  return children;
};

export default ScrollToTop;
