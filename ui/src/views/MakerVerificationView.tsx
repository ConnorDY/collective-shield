import React, { useEffect, useState, BaseSyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { pick } from 'lodash';

import User from '../models/User';
import { buildEndpointUrl, readCookie, scrollToTop } from '../utilities';
import { states } from '../utilities/constants';

const MakerVerificationView: React.FC<{ user: User }> = ({ user }) => {
  const history = useHistory();

  const [isCreated, setIsCreated] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // Request Details
  const [detailsReq, setDetailsReq] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    homePickUp: false,
    willShip: false,
    willDeliver: false,
    doesAgree: false
  });

  const resetRole = () => {
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  const updateDetailsReq = (data: object) => {
    setDetailsReq({
      ...detailsReq,
      ...data
    });
  };

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
        'firstName',
        'lastName',
        'addressLine1',
        'addressLine2',
        'city',
        'state',
        'zip',
        'phone',
        'homePickUp',
        'willShip',
        'willDeliver'
      ]);

      axios
        .put(buildEndpointUrl('me'), data)
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
    window.location.href = 'https://www.collectiveshield.org';
  }

  // on load
  useEffect(() => {
    axios.defaults.headers.post['CSRF-Token'] = readCookie('XSRF-TOKEN');

    if (user.makerDetails) {
      history.push('/');
    }
  }, []);

  return (
    <div className="request-details">
      <Row className="view-header">
        <Col>
          <h1 className="h1">Become a Collective Shield Maker!</h1>
        </Col>
      </Row>

      {isCreated ? (
        <Row>
          <Col>
            <div className="c-requestForm -pad">
              <Alert variant="success">
                Thank you! You will receive an email once your Maker account has
                been approved.
              </Alert>
            </div>
          </Col>
        </Row>
      ) : (
        <>
          <Row className="view-header">
            <Col>
              <Alert variant="info">
                Are you a healthcare provider and got here by accident?
                <Button
                  onClick={resetRole}
                  variant="link"
                  className="p-0 pl-1 m-0 mb-1"
                  style={{ verticalAlign: 'initial' }}
                >
                  Click here.
                </Button>
              </Alert>
            </Col>
          </Row>
          <Row id="requested-row-2">
            <Col>
              <h4>Contact Information</h4>
              <Form
                noValidate
                validated={isValidated}
                onSubmit={(e: React.BaseSyntheticEvent) => {
                  handleSubmit(e);
                }}
              >
                <Form.Row>
                  <Form.Group as={Col} controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={detailsReq.firstName}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ firstName: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={detailsReq.lastName}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ lastName: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="formBasicAddressLine1">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={detailsReq.addressLine1}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ addressLine1: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formBasicAddressLine2">
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control
                      required={false}
                      type="text"
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
                      required
                      value={detailsReq.city}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ city: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      value={detailsReq.state}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ state: e.target.value })
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
                      required
                      value={detailsReq.zip}
                      pattern={'[0-9]{5}'}
                      onChange={(e: BaseSyntheticEvent) => {
                        if (/^\d{0,5}$/.test(e.target.value)) {
                          updateDetailsReq({ zip: e.target.value });
                        } else e.preventDefault();
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      required
                      value={detailsReq.phone}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ phone: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row className="mt-4">
                  <Form.Group controlId="formBasicCheckboxHomePickUp">
                    <Form.Check
                      checked={detailsReq.homePickUp}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ homePickUp: e.target.checked })
                      }
                      type="checkbox"
                      label={
                        <span>
                          I'm willing to allow people to pick up products from
                          my home <br />
                          <i>
                            Future web features will include geographic matching
                            to allow people to connect in their own city
                          </i>
                        </span>
                      }
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group controlId="formBasicCheckboxWillShip">
                    <Form.Check
                      checked={detailsReq.willShip}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ willShip: e.target.checked })
                      }
                      type="checkbox"
                      label="I would like to ship to people from our database of requesters"
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group controlId="formBasicCheckboxWillDeliver">
                    <Form.Check
                      checked={detailsReq.willDeliver}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ willDeliver: e.target.checked })
                      }
                      type="checkbox"
                      label={
                        <span>
                          I'm willing to deliver products <br />
                          <i>
                            Future web features will include geographic matching
                            to allow people to connect in their own city
                          </i>
                        </span>
                      }
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group controlId="formBasicCheckboxDoesAgree">
                    <Form.Check
                      required
                      checked={detailsReq.doesAgree}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ doesAgree: e.target.checked })
                      }
                      type="checkbox"
                      label={
                        <span>
                          I agree to let Collective Shield use the information
                          I’m submitting to connect me with those requesting
                          shield prototypes (while protecting my personally
                          identifiable information), track the progress of the
                          organization towards its goals, and contact me with
                          updates or questions. This information will only be
                          used for the Collective Shield volunteer effort and no
                          other purposes. I agree to abide by the{' '}
                          <a
                            href="https://www.collectiveshield.org/about"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Collective Shield Guiding Principles
                          </a>
                          .
                        </span>
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
          </Row>
        </>
      )}
    </div>
  );
};

export default MakerVerificationView;
