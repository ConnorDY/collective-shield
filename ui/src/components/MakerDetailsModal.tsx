import React from 'react';
import { Button, Container, Modal, Row, Col } from 'react-bootstrap';

import User from '../models/User';

const MakerDetailsModal: React.FC<{
  user: User;
  onApprove: () => void;
  onClose: () => void;
}> = ({ user, onApprove, onClose }) => {
  return (
    <Modal show size="lg" onHide={onClose} backdrop>
      <div className="p-3">
        <Modal.Header>
          <Modal.Title>Maker Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </Modal.Body>

        <Modal.Footer>
          <Container>
            <Row className="justify-content-md-center p-2">
              <Col sm={6} lg={3}>
                <Button className="btn-block" onClick={onClose}>
                  Close
                </Button>
              </Col>

              <Col sm={6} lg={3}>
                <Button className="btn-block" onClick={onApprove}>
                  Approve
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
