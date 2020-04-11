import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  Row,
  Jumbotron
} from 'react-bootstrap';
import axios from 'axios';
import { find, indexOf } from 'lodash';
import { toast } from 'react-toastify';
import { Link, useHistory } from 'react-router-dom';

import User from '../models/User';
import Request from '../models/Request';
import StatusOption from '../components/StatusOption';
import { buildEndpointUrl } from '../utilities';
import { statuses } from '../utilities/constants';

const googleDriveLink =
  'https://drive.google.com/drive/folders/1-7AqfcKaGstJ0goRNiYks1Y732DsCLHn?fbclid=IwAR201HiuLkO-IfymI_jZg23gccLgJ0tLUFUPtvm7SjPjhAaEpaa9EFlROsU';

const WorkView: React.FC<{ user: User }> = ({ user }) => {
  const history = useHistory();
  const [availableWork, setAvailableWork] = useState<Request[]>([]);
  const [work, setWork] = useState<Request[]>([]);

  function getWork() {
    axios.get(buildEndpointUrl('requests/assigned')).then((res) => {
      setWork(res.data);
    });
  }

  function getAvailableWork() {
    axios.get(buildEndpointUrl(`requests/open`)).then((res) => {
      setAvailableWork(res.data);
    });
  }

  function refreshAll() {
    getWork();
    getAvailableWork();
  }

  function setStatus(id: string, status: string) {
    axios
      .patch(buildEndpointUrl(`requests/${id}/${status}`))
      .then(() => {
        const work$ = [...work];
        const updated = find(work, (f) => f._id === id);
        if (updated) {
          const index = indexOf(work, updated);
          work[index].status = status;
          setWork(work$);
        } else {
          toast.error('ERROR', {
            position: toast.POSITION.TOP_LEFT
          });
        }
      })
      .catch((err) => {
        toast.error(err.toString(), {
          position: toast.POSITION.TOP_LEFT
        });
      });
  }

  function assignWork(id: string) {
    axios
      .put(buildEndpointUrl(`requests/assign/${id}`))
      .then(() => {
        refreshAll();
      })
      .catch((err) => {
        toast.error(err.toString(), {
          position: toast.POSITION.TOP_LEFT
        });
      });
  }

  function removeWork(id: string) {
    axios
      .put(buildEndpointUrl(`requests/unassign/${id}`))
      .then(() => {
        refreshAll();
      })
      .catch((err) => {
        toast.error(err.toString(), {
          position: toast.POSITION.TOP_LEFT
        });
      });
  }

  // on load
  useEffect(() => {
    if (!user.makerDetails) {
      history.push('/verification');
    } else if (!user.isVerifiedMaker) {
      history.push('/verification-pending');
    } else {
      refreshAll();
    }
  }, []);

  var options = { weekday: 'long', month: 'long', day: 'numeric' };

  return (
    <div className="my-work">
      <Row className="view-header">
        <Col xs={12} md={6}>
          <h1 className="h1">Requests I’m Fulfilling</h1>
        </Col>

        <Col xs={12} md={6} className="right-col my-auto text-md-right">
          <a href={googleDriveLink} target="_blank" rel="noopener noreferrer">
            Download Models
          </a>
        </Col>
      </Row>

      <Row>
        {!work || !work.length ? (
          <Col>
            <Jumbotron className="text-center">No requests found.</Jumbotron>
          </Col>
        ) : (
          <Col>
            <p className="mb-4 ml-1 font-weight-bold">
              Once you claim a request it will appear in this box. Use the dropdown menu to share your progress.
              Requesters will be notified as the job progresses.
            </p>
            <div className="table-wrapper">
              <table className="my-work-table">
                <thead>
                  <tr>
                    <th className="requestedDate">Date Requested</th>
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
                    const date = new Date(w.createDate!);
                    return (
                      <tr key={index}>
                        <td className="requestedDate">
                          <Link
                            to={`/request/${w._id}`}
                            title="View details for this request"
                          >
                            {new Intl.DateTimeFormat('en-US', options).format(
                              date
                            )}
                          </Link>
                        </td>
                        <td className="count">{w.maskShieldCount}</td>
                        <td className="requestor">
                          {w.facilityName || 'Organization not provided'}
                        </td>
                        <td className="status">
                          <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle
                              id={`status-dropdown-${index}`}
                              variant="outline-secondary"
                            >
                              {StatusOption(w.status || 'Requested')}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {statuses.map((status, index2) => (
                                <Dropdown.Item
                                  key={index2}
                                  onClick={() => setStatus(w._id, status)}
                                >
                                  {StatusOption(status)}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                        <td className="action">
                          <Button
                            variant="primary"
                            onClick={() => removeWork(w._id)}
                          >
                            Unassign
                          </Button>
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

      <Row className="view-header">
        <Col>
          <h2 className="h1">Open Requests</h2>
        </Col>
      </Row>

      <Row>
        {(!availableWork || availableWork.length === 0) && (
          <Col>
            <Jumbotron className="text-center">No requests found.</Jumbotron>
          </Col>
        )}

        {availableWork && availableWork.length > 0 && (
          <Col>
            <div className="table-wrapper">
              <table className="available-work-table">
                <thead>
                  <tr>
                    <th className="requestedDate">Date Requested</th>
                    <th className="count">Count</th>
                    <th className="distance">State</th>
                    <th className="requestor">Requestor</th>
                    <th>
                      <span className="sr-only">Claim</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {availableWork.map((w, key) => {
                    const date = new Date(w.createDate!);
                    return (
                      <tr key={key}>
                        <td className="requestedDate">
                          <Link
                            to={`/request/${w._id}`}
                            title="View details for this request"
                          >
                            {new Intl.DateTimeFormat('en-US', options).format(
                              date
                            )}
                          </Link>
                        </td>
                        <td className="count">{w.maskShieldCount}</td>
                        <td className="distance">{w.addressState}</td>
                        <td className="requestor">{w.facilityName || 'Organization not provided'}</td>
                        <td className="claim">
                          <Button
                            variant="primary"
                            onClick={() => assignWork(w._id)}
                            block
                          >
                            Fulfill Requests
                          </Button>
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

export default WorkView;
