import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row, Jumbotron } from 'react-bootstrap';
import axios from 'axios';

import { buildEndpointUrl } from '../utilities';
import Maker from '../models/Maker';

export default function MakerView() {
  const history = useHistory();
  const [makers, setMakers] = useState<Maker[]>([]);

  function getMakers() {
    axios
      .get(buildEndpointUrl(`makers`))
      .then((res) => {
        setMakers(res.data);
      })
      .catch((err) => {
        if (err.response != null && err.response.status === 401) {
          return history.push('/login');
        }
        console.error(err);
      });
  }

  useEffect(() => {
    getMakers();
  }, []);

  if (!makers || !makers.length) {
    return null;
  }

  return (
    <div className="makers-list">
      <Row className="view-header">
        <Col>
          <h1 className="h1">Maker List</h1>
        </Col>
      </Row>

      <Row>
        {makers === null || makers.length === 0 ? (
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
    </div>
  );
}
