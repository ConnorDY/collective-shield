import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  Row,
  Spinner,
  Jumbotron
} from 'react-bootstrap';
import axios from 'axios';
import { get, lowerCase, indexOf } from 'lodash';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

import Request from '../models/Request';
import User from '../models/User';
import AssignMakerModal from '../components/AssignMakerModal';
import StatusOption from '../components/StatusOption';
import { buildEndpointUrl, downloadXLSX } from '../utilities';
import { formatDate } from '../utilities/formatDate';

const RequestListView: React.FC<{}> = () => {
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [allRequestsIsLoading, setAllRequestsIsLoading] = useState(false);
  const [approved, setApproved] = useState<User[]>([]);
  const [approvedIsLoading, setApprovedIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStatusTerm, setSearchStatusTerm] = useState('');
  const [modalRequestId, setModalRequestId] = useState('');

  const isLoading = allRequestsIsLoading || approvedIsLoading;

  let searchResults: any[] = [];

  function closeModal() {
    setModalRequestId('');
  }

  function getAllRequests() {
    setAllRequestsIsLoading(true);
    axios.get(buildEndpointUrl(`requests/all`)).then((res) => {
      setAllRequests(res.data);
      setAllRequestsIsLoading(false);
    });
  }

  function getApprovedMakers() {
    setApprovedIsLoading(true);
    axios.get(buildEndpointUrl('makers/approved')).then((res) => {
      setApproved(res.data);
      setApprovedIsLoading(false);
    });
  }

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const assignMaker = (event: any, shouldUnassign = false) => {
    const makerID = event.target!.value;
    const url = shouldUnassign ? `requests/unassign/${modalRequestId}` : `requests/${modalRequestId}`;
    const method = shouldUnassign ? 'put' : 'patch';
    axios[method](buildEndpointUrl(url), shouldUnassign ? undefined : { makerID })
      .then((res: any) => {
        console.log(res);
        toast.success('Maker successfully assigned!', {
          position: toast.POSITION.TOP_LEFT
        });
        const request$ = allRequests.find(f => f._id === modalRequestId);
        const index = indexOf(allRequests, request$);
        allRequests[index] = res.data;
        closeModal();
      })
      .catch(err => {
        toast.error(err.toString(), {
          position: toast.POSITION.TOP_LEFT
        });
      });
  };

  const unassignMaker = () => {
    assignMaker({ target: { value: '' }}, true);
  }

  // on load
  useEffect(() => {
    getAllRequests();
    getApprovedMakers();
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

  const onDownload = () => {
    axios
      .get(buildEndpointUrl(`requests/all/export`), {
        responseType: 'text',
        headers: { 'Content-Type': 'application/octet-stream' }
      })
      .then((res) => {
        downloadXLSX(res.data, 'Requests');
      });
  };

  return (
    isLoading ?
    <Row className="justify-content-md-center">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Row>
    :
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

        <Col xs={1} className="download">
          <Button onClick={onDownload} title="Download to XLSX">
            <FontAwesomeIcon icon={faFileExcel} />
          </Button>
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
                    <th className="product">Product</th>
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
                            {formatDate(r.createDate)}
                          </Link>
                        </td>
                        <td className="count">{r.maskShieldCount}</td>
                        <td className="requestor">
                          {r.requestor!.firstName} {r.requestor!.lastName}
                        </td>
                        <td className="printer">
                          <Button className="font-weight-bold p-0" variant="link" onClick={() => setModalRequestId(r._id)} title="Re-assign">
                            {r.maker
                              ? `${r.maker.firstName} ${r.maker.lastName}`
                              : 'Unassigned'}
                          </Button>
                        </td>
                        <td className="status">
                          {StatusOption(r.status || 'Requested')}
                        </td>
                        <td>
                          {
                            r.product ?
                              <Link to={`/product/${r.product._id}`}>
                                <img
                                  height="70px"
                                  alt={r.product.name}
                                  src={r.product.imageUrl! || '/placeholder.png'}
                                />
                              </Link>
                              :
                              'N/A'
                          }
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
      {modalRequestId && (
        <AssignMakerModal
          makers={approved}
          onAssign={assignMaker}
          onUnassign={unassignMaker}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default RequestListView;
