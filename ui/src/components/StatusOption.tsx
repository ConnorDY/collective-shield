import React from 'react';
import StatusCircle from './StatusCircle';

const StatusOption = (status: string) => {
  return (
    <>
      <StatusCircle status={status} />{' '}
      {status === 'FilterbyStatus' ? (
        <span className="toggleFilter">Filter by Status</span>
      ) : (
        status
      )}
    </>
  );
};

export default StatusOption;
