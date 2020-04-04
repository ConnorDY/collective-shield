import React, { useEffect } from 'react';
import axios from 'axios';
import { buildEndpointUrl } from '../utilities';

const HomeView: React.FC<{}> = () => {

  useEffect(() => {
    window.location.href='/logout'
  }, []);

  return null;
};

export default HomeView;
