import React, { useEffect, useState } from 'react';
import { Col, Row, Jumbotron } from 'react-bootstrap';
import axios from 'axios';

import { buildEndpointUrl } from '../utilities';
import User from '../models/User';

export default function MakersView() {
  // const [approved, setApproved] = useState<User[]>([]);
  const [unapproved, setUnapproved] = useState<User[]>([]);

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
              </table>
              {unapproved.map(({ _id, email, makerDetails }, key) => {
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
              <Jumbotron className="text-center">No approved makers found.</Jumbotron>
            </Col>
          ) : (
            <Col>
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
              </table>
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
            </Col>
          )}
        </Row>
      </div>*/}
    </>
  );
}
