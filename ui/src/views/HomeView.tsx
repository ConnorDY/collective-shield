import React from 'react';

import User from '../models/User';
import MyRequestsView from './MyRequestsView';
import WorkView from './WorkView';

const HomeView: React.FC<{ user: User; role: string | null }> = ({
  user,
  role
}) => {
  if (!role) return <></>;

  return role === 'requestor' ? (
    <MyRequestsView user={user} />
  ) : (
    <WorkView user={user} />
  );
};

export default HomeView;
