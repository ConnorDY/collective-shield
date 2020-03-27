import React from 'react';

const LoginView: React.FC = () => {
  return (
    <div>
      <div className="container">
        <div className="c-intro">
          <a href="/login/facebook">Login with Facebook</a>
          <a href="/login/google">Login with Google</a>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
