import React from 'react';
import Avatar from 'react-avatar';
import { get, omit } from 'lodash';

import User from '../models/User';

interface Props {
  name?: string;
  size: string;
  alt: string;
  round?: boolean;
  facebookId?: string;
}

const AvatarProfile: React.FC<{ user: User | undefined; size: string }> = ({
  user,
  size
}) => {
  const name =
    user && user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : undefined;
  const round = true;
  const facebookId = get(user, 'providers.facebook');

  let props: Props = {
    name,
    size,
    alt: name || 'Profile picture',
    round
  };

  if (facebookId) {
    console.log(facebookId);
    props = {
      ...omit(props, ['name']),
      facebookId
    };
  }

  return <Avatar {...props} />;
};

export default AvatarProfile;
