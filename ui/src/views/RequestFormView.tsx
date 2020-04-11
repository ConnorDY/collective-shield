import React, { useEffect, useState, BaseSyntheticEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useParams } from 'react-router';
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Col,
  Dropdown,
  Form,
  Row
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { pick } from 'lodash';

import User from '../models/User';
import Avatar from '../components/Avatar';
import StatusOption from '../components/StatusOption';
import ShippingModal from '../components/ShippingModal';
import { buildEndpointUrl, readCookie, scrollToTop } from '../utilities';
import { states, statuses } from '../utilities/constants';

const RequestFormView: React.FC<{ user: User }> = ({ user }) => {
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
    addressLine1: '',
    addressLine2: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    status: '',
    makerID: '',
    requestorID: ''
  });

  const isMakerView =
    isExisting && !isCreated && detailsReq.makerID === user._id;

  const updateDetailsReq = (data: object) => {
    setDetailsReq({
      ...detailsReq,
      ...data
    });
  };

  const roleOptions = [
    'Healthcare Worker',
    'First Responder',
    'Critical Workforce',
    'Delivery or Retail',
    'Military'
  ];

  const getDetails = () => {
    axios.get(buildEndpointUrl(`requests/${id}`)).then((res) => {
      updateDetailsReq(res.data);
    });
  };

  // Not using placeholders, but helpful function to use if we bring them back.
  const getPlaceHolder = (text: string) => {
    return disabled ? '' : text;
  };

  function setStatus(status: string) {
    axios
      .patch(buildEndpointUrl(`requests/${id}/${status}`))
      .then((res) => {
        updateDetailsReq({ status });
      })
      .catch((err) => {
        toast.error(err.toString(), {
          position: toast.POSITION.TOP_LEFT
        });
      });
  }

  function handleSubmit(event: React.BaseSyntheticEvent) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setIsValidated(true);
    } else {
      event.preventDefault();
      setIsValidated(true);

      const data = pick(detailsReq, [
        'maskShieldCount',
        'details',
        'jobRole',
        'email',
        'facilityName',
        'addressLine1',
        'addressLine2',
        'addressCity',
        'addressState',
        'addressZip'
      ]);

      axios
        .post(buildEndpointUrl('requests'), data)
        .then(() => {
          setIsCreated(true);
          scrollToTop();
        })
        .catch((err) => {
          toast.error(err.toString(), {
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

  let h1 = 'New Request';
  if (isExisting) h1 = 'Request Details';
  if (isCreated) h1 = 'Thank You!';

  return (
    <div className="request-details">
      <Row className="view-header">
        <Col>
          <h1 className="h1">
            {h1}
          </h1>
        </Col>

        <Col sm={6} className="right-col">
          <Row>
            {isMakerView && (
              <>
                <Col className="col-auto">
                  <ShippingModal />
                </Col>

                <Col className="col-auto">
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      id="details-status-dropdown"
                      variant="outline-secondary"
                    >
                      {StatusOption(detailsReq.status || 'Requested')}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {statuses.map((status) => (
                        <Dropdown.Item onClick={() => setStatus(status)}>
                          {StatusOption(status)}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </>
            )}

            {isExisting && !isMakerView && (
              <Col className="col-auto">{StatusOption(detailsReq.status)}</Col>
            )}

            <Col className="col-auto">
              <Link to="/">
                <Button>Go back</Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>

      {isExisting && (
        <Row className="view-header">
          <Col>
            <p>
              Please update the status of your job to keep the requester
              apprised of your progress using the drop-down menu in the upper
              right corner of this screen.
            </p>
            <p>
              When your job is complete, either email the requester directly to
              arrange transfer or select "Get Shipping Label" and Collective
              Shield will email a pre-paid label to you. Don’t forget to include
              the{' '}
              <a href="/PrintInsert_20200406.pdf" target="_blank">
                shipping insert
              </a>{' '}
              in your package.
            </p>
          </Col>
        </Row>
      )}

      {isCreated ? (
        <Row>
          <Col>
            <div className="c-requestForm -pad">
              <Alert variant="success">
                <div style={{ fontSize: '1.2em' }}>
                  Check back in to track the progress of your request.{' '}
                  <Link to="/">View and Follow Your Requests.</Link>
                </div>
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
                      {!isExisting && <Avatar size="100" user={user} />}
                    </Col>

                    <Col sm={9}>
                      <Card.Title id="requested-by-name">
                        {!isExisting
                          ? `${user?.firstName} ${user?.lastName}`
                          : detailsReq.email}
                      </Card.Title>
                      <Card.Text>
                        {!isExisting && (
                          <span id="requested-by-email">{user?.email}</span>
                        )}
                      </Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <h4>Number Requested</h4>
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
              <h4>Requestor Contact Information</h4>
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
                    <option value={''}>Select your Role</option>
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
                    value={detailsReq.email}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ email: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formBasicFacilityName">
                  <Form.Label>Organization (Optional)</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    type="text"
                    value={detailsReq.facilityName}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ facilityName: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridAddressLine1">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
                      value={detailsReq.addressLine1}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ addressLine1: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridAddressLine2">
                    <Form.Label>Address Line 2 (Optional)</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      value={detailsReq.addressLine2}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ addressLine2: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
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
                      <option value={''}>Choose...</option>
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
                      value={detailsReq.addressZip}
                      pattern={'[0-9]{5}'}
                      onChange={(e: BaseSyntheticEvent) => {
                        if (/^\d{0,5}$/.test(e.target.value)) {
                          updateDetailsReq({ addressZip: e.target.value });
                        } else e.preventDefault();
                      }}
                    />
                  </Form.Group>
                </Form.Row>

                {!isExisting && (
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
                )}
              </Form>
            </Col>

            <Col>
              <h4>Request Details</h4>
              <h5>Add any details or comments about the request here</h5>
              <Form>
                <Form.Group controlId="">
                  <Form.Control
                    disabled={disabled}
                    as="textarea"
                    rows="13"
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

export default RequestFormView;
