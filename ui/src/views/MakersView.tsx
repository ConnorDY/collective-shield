import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { Col, Row, Jumbotron } from 'react-bootstrap';
import axios from 'axios';

import { buildEndpointUrl } from '../utilities';
import User from '../models/User';

export default function MakerView() {
  // const history = useHistory();
  // const [makers, setMakers] = useState<User[]>([]);
  const [unapproved, setUnapproved] = useState<User[]>([]);

  // function getMakers() {
  //   axios
  //     .get(buildEndpointUrl('makers'))
  //     .then((res) => {
  //       setMakers(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       return history.push('/login');
  //     });
  // }

  function getUnapproved() {
    axios.get(buildEndpointUrl('makers/unapproved')).then((res) => {
      setUnapproved(res.data);
    });
  }

  useEffect(() => {
    // getMakers();
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
                No unapproved found.
              </Jumbotron>
            </Col>
          ) : (
            <Col>
              <table className="makers-table">
                <thead>
                  <tr>
                    <th className="name">Name</th>
                    <th className="email">Email</th>
                    <th className="prints">View Details</th>
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
                    <td>Button here</td>
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
            <h1 className="h1">All Makers</h1>
          </Col>
        </Row>

        <Row>
          {!makers || !makers.length ? (
            <Col>
              <Jumbotron className="text-center">No makers found.</Jumbotron>
            </Col>
          ) : (
            <Col>
              <table className="makers-table">
                <thead>
                  <tr>
                    <th className="name">Name</th>
                    <th className="email">Email</th>
                    <th className="prints">Total Prints</th>
                  </tr>
                </thead>
              </table>
              {makers.map((maker, key) => {
                return (
                  <tr key={key}>
                    <td>{maker.name}</td>
                    <td>{maker.email}</td>
                    <td>{maker.prints}</td>
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
