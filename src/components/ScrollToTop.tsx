import React, { useEffect, useRef } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { scrollToTop } from '../utilities';

const ScrollToTop: React.FC<{ children: any }> = ({ children }) => {
  const location = useLocation()
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
