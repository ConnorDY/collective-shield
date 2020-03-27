import React from 'react';

const StatusCircle: React.FC<{ status: string }> = ({ status }) => {
  return (
    <svg height="16" width="16" className={`status-circle status-${status}`}>
      <circle cx="8" cy="8" r="8" />
    </svg>
  );
};

export default StatusCircle;
