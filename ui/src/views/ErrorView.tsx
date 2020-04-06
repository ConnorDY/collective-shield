import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

const ErrorView: React.FC = () => {
  return (
    <div className="error-view">
      <Jumbotron className="text-center">
        <h1 className="h1 display-text">404</h1>
        <p>Sorry, page not found.</p>
      </Jumbotron>
    </div>
  );
};

export default ErrorView;
