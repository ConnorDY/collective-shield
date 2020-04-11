import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Jumbotron } from 'react-bootstrap';
import axios from 'axios';

import User from '../models/User';
import MakerDetailsModal from '../components/MakerDetailsModal';
import { buildEndpointUrl } from '../utilities';

export default function MakersView() {
  // const [approved, setApproved] = useState<User[]>([]);
  const [unapproved, setUnapproved] = useState<User[]>([]);
  const [modalUser, setModalUser] = useState<User>();

  // function getApproved() {
  //   axios
  //     .get(buildEndpointUrl('makers/approved'))
  //     .then((res) => {
  //       setApproved(res.data);
  //     })
  // }

  function getUnapproved() {
    axios.get(buildEndpointUrl('makers/unapproved')).then((res) => {
      setUnapproved(res.data);
    });
  }

  function viewDetails(user: User) {
    setModalUser(user);
  }

  function closeModal() {
    setModalUser(undefined);
  }

  useEffect(() => {
    // getApproved();
    getUnapproved();
  }, []);

  return (
    <>
      <div className="unapproved-makers-list">
        <Row className="view-header">
          <Col>
            <h1 className="h1">Unapproved Makers</h1>
          </Col>
        </Row>

        <Row>
          {!unapproved || !unapproved.length ? (
            <Col>
              <Jumbotron className="text-center">
                No unapproved makers found.
              </Jumbotron>
            </Col>
          ) : (
            <Col>
              <div className="table-wrapper">
                <table className="makers-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>
                        <span className="sr-only">View Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {unapproved.map(({ email, makerDetails }, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {makerDetails!.firstName} {makerDetails!.lastName}
                          </td>
                          <td>{email}</td>
                          <td className="view-details">
                            <Button
                              onClick={() => viewDetails(unapproved[index])}
                            >
                              View Details
                            </Button>
                          </td>
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

      {/*
      <div className="makers-list">
        <Row className="view-header">
          <Col>
            <h1 className="h1">Approved Makers</h1>
          </Col>
        </Row>

        <Row>
          {!approved || !approved.length ? (
            <Col>
              <Jumbotron className="text-center">
                No approved makers found.
              </Jumbotron>
            </Col>
          ) : (
            <Col>
              <div>
                <table className="makers-table">
                  <thead>
                    <tr>
                      <th className="name">Name</th>
                      <th className="email">Email</th>
                      <th className="view-details">
                        <span className="sr-only">View Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {approved.map(({ _id, email, makerDetails }, key) => {
                      return (
                        <tr key={key}>
                          <td>
                            {makerDetails!.firstName} {makerDetails!.lastName}
                          </td>
                          <td>{email}</td>
                          <td>Button to view details here</td>
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
      */}

      {modalUser && (
        <MakerDetailsModal onClose={() => closeModal()} user={modalUser} />
      )}
    </>
  );
}
