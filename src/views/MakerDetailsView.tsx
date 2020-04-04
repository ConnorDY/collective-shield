import React, { useEffect, useState, BaseSyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

import User from '../models/User';
import Avatar from '../components/Avatar';
import { readCookie } from '../utilities';

const MakerDetailsView: React.FC<{ user: User }> = ({ user }) => {

  const [maskRequestCount, setMaskRequestCount] = useState(1);
  const [status, setStatus] = useState('');

  const statusOptions = [
    'Requested',
    'Queued',
    'Printing',
    'Completed',
    'Shipped',
    'Delevered',
  ];

  // on load
  useEffect(() => {
    axios.defaults.headers.post['CSRF-Token'] = readCookie('XSRF-TOKEN');
  });

  return (
    <div className="new-requests">
      <Row className="view-header align-items-end">
        <Col sm={6}>
          <h1 className="h1">Request Details</h1>
        </Col>
        <Col sm={6} className="right-col">
          <Form.Group className="status-options">
            <Form.Control
              as="select"
              required
              value={status}
              onChange={(e: BaseSyntheticEvent) =>
                setStatus(e.target.value)
              }
            >
              <option>Status</option>
              {statusOptions.map((role, i) => {
                return <option key={i}>{role}</option>;
              })}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Complete
          </Button>
        </Col>
      </Row>
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
                    John Dorian
                  </Card.Title>
                  <Card.Text>
                    <span id="requested-by-email">jdmd@sacredheart.com</span>
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
          <h4>Healthcare Facility Address</h4>
          <Form>
            <Form.Group controlId="formBasicFacilityName">
              <Form.Control
                type="text"
                defaultValue="Sacred Heart Hospital"
              />
            </Form.Group>
            <Form.Group controlId="formBasicFacilityAddressLine1">
              <Form.Control
                type="text"
                defaultValue="ICU, Floor 3"
              />
            </Form.Group>
            <Form.Group controlId="formBasicFacilityAddressLine2">
              <Form.Control
                type="text"
                defaultValue="1234 Hospital Drive"
              />
            </Form.Group>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  defaultValue="Denver"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  required
                  defaultValue="CO"
                >
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  defaultValue="80205"
                />
              </Form.Group>
            </Form.Row>
          </Form>
        </Col>

        <Col>
          <h4>Request Details</h4>
          <Form>
            <Form.Group controlId="">
              <Form.Control
                as="textarea"
                rows="9"
                defaultValue="Add any request details here"
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default MakerDetailsView;