import React from 'react';
import {
  Alert,
} from 'react-bootstrap';

const VerificationPendingView: React.FC<{}> = () => {
  return (
    <div className="c-requestForm -pad">
      <Alert variant="info">
        <div style={{ fontSize: '1.2em' }}>
          If you have been re-directed to this page, it is because your Maker account is currently under review.
          Hold tight, we'll send you an email as soon as your account is approved!
        </div>
      </Alert>
    </div>
  );
};

export default VerificationPendingView;
