import React from 'react';
import { Button, Container, Modal, Row, Col, Table } from 'react-bootstrap';

import User from '../models/User';

const MakerDetailsModal: React.FC<{
  makers: User[];
  onAssign: (event: any) => void;
  onUnassign: (event: any) => void;
  onClose: () => void;
}> = ({ makers, onAssign, onUnassign, onClose }) => {
  return (
    <Modal show size="lg" onHide={onClose} backdrop>
      <div className="p-3">
        <Modal.Header closeButton>
          <Modal.Title>Assign/re-assign this request to a maker</Modal.Title>
        </Modal.Header>

        <Modal.Body className="mv-3">
          <Button variant="danger" onClick={onUnassign}>
            Unassign maker
          </Button>
        </Modal.Body>
        <Modal.Body>
          <div className="table-wrapper table-scroll-vertical">
            <Table striped bordered size="sm">
              <thead>
                <tr>
                  <th>Maker</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {makers.map((m) => (
                  <tr key={m._id}>
                    <td>
                      {m!.firstName} {m!.lastName}
                    </td>
                    <td>{m!.email || 'N/A'}</td>
                    <td>
                      <Button
                        value={m._id}
                        onClick={onAssign}
                        variant="primary"
                      >
                        Assign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Container>
            <Row className="justify-content-md-center p-2">
              <Col sm={6} lg={3}>
                <Button className="btn-block" onClick={onClose}>
                  Close
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default MakerDetailsModal;
