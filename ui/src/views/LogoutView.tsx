import React, { useEffect } from 'react';
import axios from 'axios';
import { buildEndpointUrl } from '../utilities';

const HomeView: React.FC<{}> = () => {
  useEffect(() => {
    axios.get(buildEndpointUrl('logout')).then(() => {
      window.location.href = 'https://www.collectiveshield.org';
    });
  }, []);

  return null;
};

export default HomeView;
