import React from 'react';
import { Button, Container, Modal, Row, Col } from 'react-bootstrap';

const RoleModal: React.FC<{
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setRole }) => {
  function pickRole(role: string) {
    localStorage.setItem('role', role);
    setRole(role);
  }

  return (
    <Modal show size="lg" backdrop>
      <div className="p-3">
        <Modal.Header>
          <Modal.Title>Choose Your Role</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Are you a maker or a critical worker requesting personal protective
            equipment (PPE)?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Container>
            <Row className="justify-content-md-center p-2">
              <Col sm={6} lg={4}>
                <Button
                  variant="primary"
                  className="mr-2 mb-2 mb-sm-0 btn-block"
                  onClick={() => pickRole('maker')}
                >
                  Maker
                </Button>
              </Col>
              <Col sm={6} lg={4}>
                <Button
                  variant="primary"
                  onClick={() => pickRole('requester')}
                  className="btn-block"
                >
                  Critical Worker
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default RoleModal;
