import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import User from '../models/User';

const HomeView: React.FC<{ user: User }> = ({ user }) => {
  const history = useHistory();

  // useEffect(() => {
  //   if (user && user.maker) {
  //     history.push('/work');
  //   }
  // }, []);

  return null;
};

export default HomeView;
