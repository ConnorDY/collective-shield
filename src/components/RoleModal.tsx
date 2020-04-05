import React from 'react';
import {
  Button,
  Container,
  Modal,
  Row
  // ToggleButton,
  // ToggleButtonGroup
} from 'react-bootstrap';

const RoleModal: React.FC<{
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setRole }) => {
  function pickRole(role: string) {
    sessionStorage.setItem('role', role);
    setRole(role);
  }

  return (
    <Modal show size="lg" backdrop>
      <Modal.Header>
        <Modal.Title>Choose Your Role</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Do you have a 3D Printer and want to print mask shields or do you work
        at a healthcare facility and want to request mask shields?
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
    </Modal>
  );
};

export default RoleModal;
