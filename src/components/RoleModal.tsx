import React from 'react';
import { Button, Container, Modal, Row } from 'react-bootstrap';

const RoleModal: React.FC<{
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setRole }) => {
  function pickRole(role: string) {
    sessionStorage.setItem('role', role);
    setRole(role);
  }

  return (
    <Modal show size="lg" backdrop>
      <div className="p-3">
        <Modal.Header>
          <Modal.Title>Choose Your Role</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Do you have a 3D printer and want to print mask shields?</p>
          <p>
            Or, do you work at a healthcare facility and want to request mask
            shields?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Container>
            <Row className="justify-content-md-center p-2">
              <Button
                variant="primary"
                className="mr-2"
                onClick={() => pickRole('maker')}
              >
                Printer / Maker
              </Button>

              <Button variant="primary" onClick={() => pickRole('requestor')}>
                Requestor
              </Button>
            </Row>
          </Container>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default RoleModal;
