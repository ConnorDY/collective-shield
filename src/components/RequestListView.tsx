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

  var options = { weekday: 'long', month: 'long', day: 'numeric' };

  return (
    <>
      <Row className="work-view-header">
        <Col>
          <h1>Requests</h1>
        </Col>
      </Row>

      <Row>
        {(!allRequests || allRequests.length === 0) && (
          <Col className="no-work">No request found</Col>
        )}

        {allRequests && allRequests.length > 0 && (
          <Col>
            <div className="table-wrapper">
              <table className="requested-list-table">
                <thead>
                  <tr>
                    <th className="requestedDate">Date Requested</th>
                    <th className="count">Count</th>
                    <th className="requestor">Requestor</th>
                    <th className="printer">Printer</th>
                    <th className="status">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {allRequests.map((r, key) => {
                    const date = new Date(r.createDate);
                    console.log(date);
                    return (
                      <tr key={key}>
                        <td className="requestedDate">
                          {new Intl.DateTimeFormat('en-US', options).format(date)}</td>
                        <td className="count">{r.count}</td>
                        <td className="requestor">{r.name}</td>
                        <td className="printer">Printer</td>
                        <td className="status">{StatusOption(r.status || 'Requested')}</td>
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
