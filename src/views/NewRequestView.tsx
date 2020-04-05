import React, { useEffect, useState, BaseSyntheticEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useParams } from "react-router";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Col,
  Dropdown,
  Form,
  Row,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { pick } from 'lodash';

import User from '../models/User';
import Avatar from '../components/Avatar';
import StatusOption from '../components/StatusOption';
import { buildEndpointUrl, readCookie } from '../utilities';
import { states, statuses } from '../utilities/constants';

const NewRequestView: React.FC<{ user: User }> = ({ user }) => {
  const history = useHistory();
  let { id } = useParams();

  const isExisting = id;
  const disabled = !!isExisting;

  const [isCreated, setIsCreated] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // Request Details
  const [detailsReq, setDetailsReq] = useState({
    maskShieldCount: 1,
    details: '',
    jobRole: '',
    email: '',
    facilityName: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    status: '',
    makerID: '',
    requestorID: '',
  })

  const dropdownEnabled = isExisting && !isCreated && detailsReq.makerID === user._id;

  const updateDetailsReq = (data: object) => {
    setDetailsReq({
      ...detailsReq,
      ...data,
    });
  }

  const roleOptions = [
    'Doctor',
    'Nurse',
    'First Responder',
    'Medical Support Staff'
  ];

  const getDetails = () => {
    axios.get(buildEndpointUrl(`requests/${id}`)).then((res) => {
      updateDetailsReq(res.data);
    });
  }

  const getPlaceHolder = (text: string) => {
    return disabled ? '' : text;
  }

  function setStatus(status: string) {
    axios
      .patch(buildEndpointUrl(`requests/${id}/${status}`))
      .then((res) => {
        updateDetailsReq({ status });
      })
      .catch((err) => {
        toast.error(`ERROR: ${err}`, {
          position: toast.POSITION.TOP_LEFT
        });
      });
  }

  function handleSubmit(event: React.BaseSyntheticEvent) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setIsValidated(!isValidated);

      const data = pick(detailsReq, [
        'maskShieldCount',
        'details',
        'jobRole',
        'email',
        'facilityName',
        'addressCity',
        'addressState',
        'addressZip',
      ])

      axios
        .post(buildEndpointUrl('requests'), data)
        .then(() => {
          setIsCreated(true);
        })
        .catch((err) => {
          toast.error(`ERROR: ${err}`, {
            position: toast.POSITION.TOP_LEFT
          });
        });
    }
  }

  function cancel() {
    history.push('/');
  }

  // on load
  useEffect(() => {
    axios.defaults.headers.post['CSRF-Token'] = readCookie('XSRF-TOKEN');

    if (id) getDetails();
  }, []);

  return (
    <div className="new-requests">
      <Row className="view-header">
        <Col>
          <h1 className="h1">{ isExisting ? 'Request Details' : 'New Request' }</h1>
        </Col>
          <Col sm={6} className="right-col">
            {
              dropdownEnabled ?
                <Dropdown as={ButtonGroup}>
                  <Dropdown.Toggle
                    id="details-status-dropdown"
                    variant="outline-secondary"
                  >
                    {StatusOption(detailsReq.status || 'Requested')}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {statuses.map((status) => (
                      <Dropdown.Item
                        onClick={() => setStatus(status)}
                      >
                        {StatusOption(status)}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              :
              StatusOption(detailsReq.status)
            }
          </Col>
      </Row>

      {isCreated ? (
        <Row>
          <Col>
            <div className="c-requestForm -pad">
              <Alert variant="success">
                {' '}
                Thank you! You will receive an email confirming your request.{' '}
                <Link to="/">View Your Requests.</Link>
              </Alert>
            </div>
          </Col>
        </Row>
      ) : (
        <>
          <Row id="requested-row-1">
            <Col>
              <h4>Request Submitted By</h4>
              <Card bg="light" id="requested-by-card">
                <Card.Body>
                  <Row>
                    <Col sm={3}>
                      {
                        !isExisting &&
                          <Avatar size="100" user={user} />
                      }
                    </Col>

                    <Col sm={9}>
                      <Card.Title id="requested-by-name">
                        {
                          !isExisting ?
                            `${user?.firstName} ${user?.lastName}`
                            :
                            detailsReq.email
                        }
                      </Card.Title>
                      <Card.Text>
                      {
                        !isExisting &&
                          <span id="requested-by-email">{user?.email}</span>
                      }
                      </Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <h4>Mask Shields Requested</h4>
              <Form>
                <Form.Group>
                  <Form.Control
                    disabled={disabled}
                    as="select"
                    size="lg"
                    custom
                    id="requested-mask-shields-card"
                    value={detailsReq.maskShieldCount}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ maskShieldCount: e.target.value })
                    }
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Col>
          </Row>

          <Row id="requested-row-2">
            <Col>
              <h4>Healthcare Facility</h4>
              <Form
                noValidate
                validated={isValidated}
                onSubmit={(e: React.BaseSyntheticEvent) => {
                  handleSubmit(e);
                }}
              >
                <Form.Group controlId="formBasicJobTitle">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    as="select"
                    required
                    value={detailsReq.jobRole}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ jobRole: e.target.value })
                    }
                  >
                    <option>Select Your Role</option>
                    {roleOptions.map((role, i) => {
                      return <option key={i}>{role}</option>;
                    })}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Preferred Email Address</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    required
                    type="email"
                    placeholder={getPlaceHolder("Email")}
                    value={detailsReq.email}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ email: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formBasicFacilityName">
                  <Form.Label>Facility Name</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    required
                    type="text"
                    placeholder={getPlaceHolder("Sacred Heart Hospital")}
                    value={detailsReq.facilityName}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ facilityName: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
                      placeholder={getPlaceHolder("Denver")}
                      value={detailsReq.addressCity}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ addressCity: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
                      as="select"
                      value={detailsReq.addressState}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ addressState: e.target.value })
                      }
                    >
                      <option>Choose...</option>
                      {states.map((state, i) => (
                        <option key={i}>{state}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
                      placeholder={getPlaceHolder("80205")}
                      value={detailsReq.addressZip}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ addressZip: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form.Row>

                {
                  !isExisting &&
                    <div id="request-button-group">
                      <Button variant="primary" type="submit">
                        Submit Request
                      </Button>

                      <Button
                        variant="light"
                        id="cancel-request-button"
                        onClick={cancel}
                      >
                        Cancel Request
                      </Button>
                    </div>
                }
              </Form>
            </Col>

            <Col>
              <h4>Request Details</h4>
              <Form>
                <Form.Group controlId="">
                  <Form.Control
                    disabled={disabled}
                    as="textarea"
                    rows="13"
                    placeholder={getPlaceHolder("Add any request details here")}
                    value={detailsReq.details}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ details: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default NewRequestView;
