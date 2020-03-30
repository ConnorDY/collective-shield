import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Dropdown, Row } from 'react-bootstrap';
import axios from 'axios';

import { buildEndpointUrl } from '../utilities';
import User from '../models/User';
import Maker from '../models/Maker';
import StatusCircle from './StatusCircle';

const RequestListView: React.FC<{ user: User }> = ({ user }) => {
  //this.refreshTimer = null;

  const [allRequests, setAllRequests] = useState<any[]>([]);
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

  function getAllRequests() {
    axios.get(buildEndpointUrl(`requests/`)).then((res) => {
        console.log(res);
        setAllRequests(res.data);
    });
  }

  function StatusOption(status: string): JSX.Element {
    return (
      <>
        <StatusCircle status={status} /> {status}
      </>
    );
  }

  // on load
  useEffect(() => {
    getMaker();
    getWork();
    getAllRequests();
  }, []);

  if (!maker) {
    return null;
  }

  return (
    <>
      <Row className="work-view-header">
        <Col>
          <h1>Open Requests</h1>
        </Col>
      </Row>

      <Row>
        {(!allRequests || allRequests.length === 0) && (
          <Col className="no-work">No work found</Col>
        )}

        {allRequests && allRequests.length > 0 && (
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
                  {allRequests.map((w, key) => {
                      console.log(w);
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

export default RequestListView;
