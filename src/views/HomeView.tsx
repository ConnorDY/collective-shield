import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import User from '../models/User';
import MyRequestsView from '../components/MyRequestsView';

const HomeView: React.FC<{ user: User }> = ({ user }) => {
  const history = useHistory();

  useEffect(() => {
    if (user && user.maker) {
      history.push('/work');
    }
  }, []);

  if (!user.maker) {
    return <MyRequestsView />;
  }
  return null;
};

export default HomeView;
