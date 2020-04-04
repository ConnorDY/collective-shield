import React, { useEffect, useState, BaseSyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  ButtonGroup,
  Dropdown
} from 'react-bootstrap';
import axios from 'axios';

import User from '../models/User';
import Avatar from '../components/Avatar';
import { readCookie } from '../utilities';
import StatusOption from '../components/StatusOption';

const MakerDetailsView: React.FC<{ user: User }> = ({ user }) => {
  const [maskRequestCount, setMaskRequestCount] = useState(1);
  const [status, setStatus] = useState<any[]>([]);

  const statusOptions = [
    'Requested',
    'Queued',
    'Printing',
    'Completed',
    'Shipped',
    'Delivered'
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
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Status
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>{StatusOption('Requested')}</Dropdown.Item>
              <Dropdown.Item>{StatusOption('Queued')}</Dropdown.Item>
              <Dropdown.Item>{StatusOption('Printing')}</Dropdown.Item>
              <Dropdown.Item>{StatusOption('Completed')}</Dropdown.Item>
              <Dropdown.Item>{StatusOption('Shipped')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
                  <Card.Title id="requested-by-name">John Dorian</Card.Title>
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
                disabled
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
                disabled
                type="text"
                defaultValue="Sacred Heart Hospital"
              />
            </Form.Group>
            <Form.Group controlId="formBasicFacilityAddressLine1">
              <Form.Control disabled type="text" defaultValue="ICU, Floor 3" />
            </Form.Group>
            <Form.Group controlId="formBasicFacilityAddressLine2">
              <Form.Control
                disabled
                type="text"
                defaultValue="1234 Hospital Drive"
              />
            </Form.Group>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control disabled defaultValue="Denver" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Control disabled defaultValue="CO"></Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control disabled defaultValue="80205" />
              </Form.Group>
            </Form.Row>
          </Form>
        </Col>

        <Col>
          <h4>Request Details</h4>
          <Form>
            <Form.Group controlId="">
              <Form.Control
                disabled
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
