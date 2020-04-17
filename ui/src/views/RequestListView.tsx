import React, { useEffect, useState } from 'react';
import { ButtonGroup, Col, Dropdown, Row, Jumbotron } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import { get, lowerCase } from 'lodash';
import { Link } from 'react-router-dom';

import Request from '../models/Request';
import StatusOption from '../components/StatusOption';
import { buildEndpointUrl } from '../utilities';

const RequestListView: React.FC<{}> = () => {
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStatusTerm, setSearchStatusTerm] = useState('');

  let searchResults: any[] = [];

  function getAllRequests() {
    axios.get(buildEndpointUrl(`requests/all`)).then((res) => {
      setAllRequests(res.data);
    });
  }
  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // on load
  useEffect(() => {
    getAllRequests();
  }, []);

  if (allRequests.length) {
    const keys = [
      'facilityName',
      'addressCity',
      'addressState',
      'addressZip',
      'requestorID',
      'makerID',
      'firstName',
      'lastName',
      'maker.firstName',
      'maker.lastName'
    ];

    const results = allRequests.filter((m) => {
      return (
        get(m, 'status', '').includes(searchStatusTerm) &&
        keys.some((k) => {
          return lowerCase(get(m, k, '')).includes(lowerCase(searchTerm || ''));
        })
      );
    });
    searchResults = results;
  }

  const onSelect = (status: any) => {
    setSearchStatusTerm(status);
  };

  console.log(allRequests);
  return (
    <div className="all-requests">
      <Row className="view-header">
        <Col>
          <h1 className="h1">Requests</h1>
        </Col>
        <Col className="searchInput">
          <input
            type="text"
            placeholder="Search by Name or Address"
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
          <Col>
            <Jumbotron className="text-center">No request found.</Jumbotron>
          </Col>
        )}

        {allRequests && allRequests.length > 0 && (
          <Col>
            <div className="table-wrapper">
              <table className="requested-list-table">
                <thead>
                  <tr>
                    <th className="requestedDate">Date</th>
                    <th className="count">Count</th>
                    <th className="requestor">Requester</th>
                    <th className="printer">Printer</th>
                    <th className="status">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {searchResults.map((r) => {
                    return (
                      <tr key={r._id}>
                        <td className="requestedDate">
                          <Link
                            to={`/request/${r._id}`}
                            title="View details for this request"
                          >
                            {moment(r.createDate).format('DD/MM/YY')}
                          </Link>
                        </td>
                        <td className="count">{r.maskShieldCount}</td>
                        <td className="requestor">
                          {r.requestor!.firstName} {r.requestor!.lastName}
                        </td>
                        <td className="printer">
                          {r.maker
                            ? `${r.maker.firstName} ${r.maker.lastName}`
                            : ''}
                        </td>
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
