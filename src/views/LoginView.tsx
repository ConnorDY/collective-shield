import React from 'react';
import { Container } from 'react-bootstrap';

import AuthModal from '../components/AuthModal';

const LoginView: React.FC = () => {
  return (
    <Container>
      <AuthModal />
    </Container>
  );
};

export default LoginView;
