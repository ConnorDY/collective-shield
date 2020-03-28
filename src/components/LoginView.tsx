import React from 'react';
import AuthModal from './AuthModal';

const LoginView: React.FC = () => {
  return (
    <div>
      <div className="container">
        <div className="c-intro">
        </div>
        <AuthModal />
      </div>
    </div>
  );
};

export default LoginView;
