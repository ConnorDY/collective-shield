import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, Row, Jumbotron } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import User from '../models/User';
import Request from '../models/Request';
import { buildEndpointUrl } from '../utilities';
import { formatDate } from '../utilities/formatDate';

const MyRequestsView: React.FC<{ user: User }> = ({ user }) => {
  const history = useHistory();
  const [requests, setRequests] = useState<Request[] | null>(null);

  function createNewRequest() {
    history.push('/request');
  }

  useEffect(() => {
    axios.get(buildEndpointUrl('requests/me')).then((res) => {
      setRequests(res.data);
    });
  }, []);

  return (
    <div className="my-requests">
      <Row className="view-header">
        <Col xs={12} md={6}>
          <h1 className="h1">My Requests</h1>
        </Col>

        <Col xs={12} md={6} className="right-col my-auto text-sm-right">
          <Button variant="primary" onClick={createNewRequest}>
            New Request
          </Button>
        </Col>
      </Row>

      <Row>
        {!requests || !requests.length ? (
          <Col>
            <Jumbotron className="text-center">
              You have not made a request.{' '}
              <Button variant="link" onClick={createNewRequest}>
                Create A New Request Now.
              </Button>
            </Jumbotron>
          </Col>
        ) : (
          <Col>
            <div className="table-wrapper">
              <table className="my-work-table">
                <thead>
                  <tr>
                    <th className="date">Date</th>
                    <th className="count">Count</th>
                    <th className="details">Details</th>
                    <th className="status">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => {
                    return (
                      <tr key={request._id}>
                        <td className="date">
                          <Link
                            to={`/request/${request._id}`}
                            title="View details for this request"
                          >
                            {formatDate(request.createDate!)}
                          </Link>
                        </td>
                        <td className="count">{request.maskShieldCount}</td>
                        <td className="details">
                          {request.details.substring(0, 21)}
                          {get(request, 'details', '').length > 20 ? '...' : ''}
                        </td>
                        <td className="status">{request.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default MyRequestsView;
