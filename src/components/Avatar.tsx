import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { get, omit } from 'lodash';
import User from '../models/User';

interface Props {
  name?: string;
  size: string;
  round?: boolean;
  facebookId?: string;
  googleId?: string;
}

const AvatarProfile: React.FC<{ user: User | undefined, size: string }> = ({ user, size }) => {
  const name = user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined;
  const round = true;
  const facebookId = get(user, 'providers.facebook');
  const googleId = get(user, 'providers.google');

  let props: Props = {
    name,
    size,
    round,
  }

  if (facebookId) {
    console.log(facebookId)
    props = {
      ...omit(props, ['name']),
      facebookId,
    }
  } else if (googleId) {
    props = {
      ...omit(props, ['name']),
      googleId,
    }
  }

  return (
    <Avatar {...props} />
  )
};

export default AvatarProfile;
