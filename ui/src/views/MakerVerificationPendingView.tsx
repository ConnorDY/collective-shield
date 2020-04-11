import React from 'react';
import { Alert } from 'react-bootstrap';

const VerificationPendingView: React.FC<{}> = () => {
  return (
    <div className="c-requestForm -pad">
      <Alert variant="info">
        If you have been re-directed to this page, it is because your Maker
        account is currently under review. Hold tight, we'll send you an email
        as soon as your account is approved!
      </Alert>
    </div>
  );
};

export default VerificationPendingView;
