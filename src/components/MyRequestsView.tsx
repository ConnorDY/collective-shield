import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Button, Col, Row } from 'react-bootstrap';

import User from '../models/User';
import { buildEndpointUrl } from '../utilities';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const MyRequestsView: React.FC<{ user: User }> = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState<any>(null);

  const makers: any[] = [];

  function createNewRequest(e: React.MouseEvent) {
    e.preventDefault();

    setNewRequest({
      createDate: new Date(),
      userId: user._id
    });
  }

  function handleModalClose() {
    setNewRequest(null);
  }

  useEffect(() => {
    axios.get(buildEndpointUrl('requests/me')).then((res) => {
      setRequests(res.data);
    });
  }, []);

  return (
    <div className="my-requests">
      <Row className="view-header">
        <Col>
          <h1 className="h1">Your Requests</h1>
        </Col>

        <Col className="right-col">
          <Button variant="primary" onClick={createNewRequest}>
            New Request
          </Button>
        </Col>
      </Row>

      <Row>
        {!makers || !makers.length ? (
          <Col className="no-work panel empty">
            You have not made a request.{' '}
            <Button variant="link" onClick={createNewRequest}>
              Create A New Request Now.
            </Button>
          </Col>
        ) : (
          <Col>
            <div className="table-wrapper">
              <table className="my-work-table">
                <thead>
                  <tr>
                    <th className="name">Name</th>
                    <th className="email">Email</th>
                    <th className="prints">Total Prints</th>
                  </tr>
                </thead>

                <tbody>
                  {makers.map((maker, key) => {
                    return (
                      <tr key={key}>
                        <td className="name">{maker.name}</td>
                        <td className="email">{maker.email}</td>
                        <td className="prints">{maker.prints}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Col>
        )}
      </Row>

      <Modal
        contentLabel="Add A Request"
        isOpen={!!newRequest}
        onRequestClose={handleModalClose}
        style={customStyles}
      >
        Request form goes here.
      </Modal>
    </div>
  );
};

export default MyRequestsView;
