import React, { useEffect, useState, BaseSyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

import User from '../models/User';
import Avatar from '../components/Avatar';
import { buildEndpointUrl, readCookie } from '../utilities';
import { states } from '../utilities/constants';

const NewRequestView: React.FC<{ user: User | undefined }> = ({ user }) => {
  const history = useHistory();

  const [isCreated, setIsCreated] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [maskRequestCount, setMaskRequestCount] = useState(1);
  const [requestDetails, setRequestDetails] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [city, setCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [zip, setZip] = useState('');

  const roleOptions = [
    'Doctor',
    'Nurse',
    'First Responder',
    'Medical Support Staff'
  ];

  function handleSubmit(event: React.BaseSyntheticEvent) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setIsValidated(!isValidated);

      if (isValidated) {
        const data = {
          maskRequestCount,
          requestDetails,
          jobTitle,
          email,
          facilityName,
          city,
          addressState,
          zip
        };

        axios
          .post(buildEndpointUrl('request', '/public'), data)
          .then((res) => {
            setIsCreated(!isCreated);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }

  function cancel() {
    history.push('/');
  }

  // on load
  useEffect(() => {
    axios.defaults.headers.post['CSRF-Token'] = readCookie('XSRF-TOKEN');
  });

  return (
    <div className="new-requests">
      <Row className="view-header">
        <Col>
          <h1 className="h1">New Request</h1>
        </Col>
      </Row>

      {isCreated && (
        <Row>
          <Col>
            <div className="c-requestForm -pad">
              <Alert variant="success">
                {' '}
                Thank you! You will receive an email confirming your request{' '}
              </Alert>
            </div>
          </Col>
        </Row>
      )}
      {!isCreated && (
        <>
          <Row id="requested-row-1">
            <Col>
              <h4>Request Submitted By</h4>
              <Card bg="light" id="requested-by-card">
                <Card.Body>
                  <Row>
                    <Col sm={3}>
                      <Avatar size="100" user={user} />
                    </Col>

                    <Col sm={9}>
                      <Card.Title id="requested-by-name">
                        {user?.firstName} {user?.lastName}
                      </Card.Title>
                      <Card.Text>
                        <span id="requested-by-email">{user?.email}</span>
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
                    as="select"
                    size="lg"
                    custom
                    id="requested-mask-shields-card"
                    value={maskRequestCount}
                    onChange={(e: BaseSyntheticEvent) =>
                      setMaskRequestCount(e.target.value)
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
                    as="select"
                    required
                    value={jobTitle}
                    onChange={(e: BaseSyntheticEvent) =>
                      setJobTitle(e.target.value)
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
                    required
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e: BaseSyntheticEvent) =>
                      setEmail(e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formBasicFacilityName">
                  <Form.Label>Facility Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Sacred Heart Hospital"
                    value={facilityName}
                    onChange={(e: BaseSyntheticEvent) =>
                      setFacilityName(e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      required
                      placeholder="Denver"
                      value={city}
                      onChange={(e: BaseSyntheticEvent) =>
                        setCity(e.target.value)
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      value={addressState}
                      onChange={(e: BaseSyntheticEvent) =>
                        setAddressState(e.target.value)
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
                      required
                      placeholder="80205"
                      value={zip}
                      onChange={(e: BaseSyntheticEvent) =>
                        setZip(e.target.value)
                      }
                    />
                  </Form.Group>
                </Form.Row>

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
              </Form>
            </Col>

            <Col>
              <h4>Request Details</h4>
              <Form>
                <Form.Group controlId="">
                  <Form.Control
                    as="textarea"
                    rows="13"
                    placeholder="Add any request details here"
                    value={requestDetails}
                    onChange={(e: BaseSyntheticEvent) =>
                      setRequestDetails(e.target.value)
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
