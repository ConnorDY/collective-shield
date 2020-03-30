import React from 'react';
import { Container } from 'react-bootstrap';
import AuthModal from './AuthModal';

const LoginView: React.FC = () => {
  return (
    <Container>
      <AuthModal />
    </Container>
  );
};

export default LoginView;
