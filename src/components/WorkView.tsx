import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Dropdown, Row } from 'react-bootstrap';
import axios from 'axios';

import { buildEndpointUrl } from '../utilities';
import User from '../models/User';
import Maker from '../models/Maker';
import StatusOption from './StatusOption';

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
                    <th className="count">Count</th>
                    <th className="requestor">Requestor</th>
                    <th>Status</th>
                    <th>
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {work.map((w, index) => {
                    return (
                      <tr key={index}>
                        <td className="count">{w.count}</td>
                        <td className="requestor">{w.name}</td>
                        <td className="status">
                          <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle
                              id={`status-dropdown-${index}`}
                              variant="outline-secondary"
                            >
                              {StatusOption(w.status || 'Requested')}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item>
                                {StatusOption('Requested')}
                              </Dropdown.Item>

                              <Dropdown.Item>
                                {StatusOption('Queued')}
                              </Dropdown.Item>

                              <Dropdown.Item>
                                {StatusOption('Printing')}
                              </Dropdown.Item>

                              <Dropdown.Item>
                                {StatusOption('Completed')}
                              </Dropdown.Item>

                              <Dropdown.Item>
                                {StatusOption('Shipped')}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                        <td className="action">
                          <Button variant="primary">{'{Action}'}</Button>
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
                    <th className="count">Count</th>
                    <th className="distance">Distance</th>
                    <th className="requestor">Requestor</th>
                    <th>
                      <span className="sr-only">Claim</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {availableWork.map((w, key) => {
                    return (
                      <tr key={key}>
                        <td className="count">{w.count}</td>
                        <td className="distance">X miles</td>
                        <td className="requestor">{w.name}</td>
                        <td className="claim">
                          <Button variant="primary">Claim</Button>
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
    </>
  );
};

export default WorkView;
