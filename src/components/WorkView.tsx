import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';

import { buildEndpointUrl } from '../utilities';
import User from '../models/User';
import Maker from '../models/Maker';

const WorkView: React.FC<{ user: User }> = ({ user }) => {
  //this.refreshTimer = null;

  const [availableWork, setAvailableWork] = useState<any[]>([]);
  const [maker, setMaker] = useState<Maker>();
  const [work, setWork] = useState<any[]>([]);

  function getMaker() {
    axios.get(buildEndpointUrl(`makers/${user.makerId}`)).then((res) => {
      setMaker(res.data);
    });
  }

  function getWork() {
    axios.get(buildEndpointUrl(`makers/${user.makerId}/work`)).then((res) => {
      setWork(res.data);
    });
  }

  function getAvailableWork() {
    axios.get(buildEndpointUrl(`requests/open`)).then((res) => {
      setAvailableWork(res.data);
    });
  }

  // on load
  useEffect(() => {
    getMaker();
    getWork();
    getAvailableWork();
  }, []);

  if (!maker) {
    return null;
  }

  return (
    <>
      <Row className="work-view-header">
        <Col>
          <h1>My Work</h1>
        </Col>

        <Col className="download-models">Download Models</Col>
      </Row>

      <Row>
        {(!work || work.length === 0) && (
          <Col className="no-work">No work found</Col>
        )}

        {work && work.length > 0 && (
          <Col>
            <div className="table-wrapper">
              <table className="my-work-table">
                <thead>
                  <tr>
                    <th>Count</th>
                    <th>Requestor</th>
                    <th>Status</th>
                    <th>
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {work.map((w, key) => {
                    return (
                      <tr key={key}>
                        <td>{w.count}</td>
                        <td>{w.name}</td>
                        <td>{w.status}</td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Col>
        )}
      </Row>

      <Row className="work-view-header">
        <Col>
          <h1>Open Requests</h1>
        </Col>
      </Row>

      <Row>
        {(!availableWork || availableWork.length === 0) && (
          <Col className="no-work">No work found</Col>
        )}

        {availableWork && availableWork.length > 0 && (
          <Col>
            <div className="table-wrapper">
              <table className="available-work-table">
                <thead>
                  <tr>
                    <th>Count</th>
                    <th>Distance</th>
                    <th>Requestor</th>
                    <th>
                      <span className="sr-only">Claim</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {availableWork.map((w, key) => {
                    return (
                      <tr key={key}>
                        <td>{w.count}</td>
                        <td>X miles</td>
                        <td>{w.name}</td>
                        <td>Claim</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

export default WorkView;
