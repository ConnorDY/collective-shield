import React, { useEffect, useState } from 'react';
import { ButtonGroup, Col, Dropdown, Row } from 'react-bootstrap';
import axios from 'axios';
import { get, lowerCase } from 'lodash';

import User from '../models/User';
import Maker from '../models/Maker';
import MockData from '../models/MockRequestData';
import StatusOption from '../components/StatusOption';
import { buildEndpointUrl } from '../utilities';

const RequestListView: React.FC<{ user: User }> = ({ user }) => {
  //this.refreshTimer = null;

  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [maker, setMaker] = useState<Maker>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStatusTerm, setSearchStatusTerm] = useState('');

  let searchResults: any[] = [];

  function getMaker() {
    axios.get(buildEndpointUrl(`makers/${user._id}`)).then((res) => {
      setMaker(res.data);
    });
  }

  function getAllRequests() {
    axios.get(buildEndpointUrl(`requests/`)).then((res) => {
      setAllRequests(res.data);
    });
  }
  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // on load
  useEffect(() => {
    getMaker();
    getAllRequests();
  }, []);

  if (!maker) {
    return null;
  }

  if (MockData) {
    // temporarily using 'MockData'. It needs to be replaced by 'allRequests'
    const keys = [
      'address.line1',
      'address.line2',
      'address.city',
      'address.state',
      'address.zip',
      'name',
      'printer'
    ];

    const results = MockData.filter((m) => {
      return (
        get(m, 'status', '').includes(searchStatusTerm) &&
        keys.some((k) =>
          lowerCase(get(m, k, '')).includes(lowerCase(searchTerm || ''))
        )
      );
    });
    searchResults = results;
  }

  var options = { weekday: 'long', month: 'long', day: 'numeric' };

  const onSelect = (status: any) => {
    setSearchStatusTerm(status);
  };

  return (
    <div className="all-requests">
      <Row className="view-header">
        <Col>
          <h1 className="h1">Requests</h1>
        </Col>
        <Col className="searchInput">
          <input
            type="text"
            placeholder="Search by Name of Address"
            value={searchTerm}
            onChange={handleChange}
          />
        </Col>
        <Col className="statusFilter">
          <Dropdown as={ButtonGroup} onSelect={onSelect}>
            <Dropdown.Toggle
              id={`status-dropdown-1`}
              variant="outline-secondary"
            >
              {StatusOption(searchStatusTerm || 'FilterbyStatus')}
            </Dropdown.Toggle>

            <Dropdown.Menu onSelect={onSelect}>
              <Dropdown.Item eventKey="">{StatusOption('All')}</Dropdown.Item>

              <Dropdown.Item eventKey="Requested">
                {StatusOption('Requested')}
              </Dropdown.Item>

              <Dropdown.Item eventKey="Queued">
                {StatusOption('Queued')}
              </Dropdown.Item>

              <Dropdown.Item eventKey="Printing">
                {StatusOption('Printing')}
              </Dropdown.Item>

              <Dropdown.Item eventKey="Completed">
                {StatusOption('Completed')}
              </Dropdown.Item>

              <Dropdown.Item eventKey="Shipped">
                {StatusOption('Shipped')}
              </Dropdown.Item>

              <Dropdown.Item eventKey="Delivered">
                {StatusOption('Delivered')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
                  {searchResults.map((r, key) => {
                    const date = new Date(r.createDate);
                    return (
                      <tr key={key}>
                        <td className="requestedDate">
                          {new Intl.DateTimeFormat('en-US', options).format(
                            date
                          )}
                        </td>
                        <td className="count">{r.count}</td>
                        <td className="requestor">{r.name}</td>
                        <td className="printer">{r.printer}</td>
                        <td className="status">
                          {StatusOption(r.status || 'Requested')}
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
  );
};

export default RequestListView;
