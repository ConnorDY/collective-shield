import React, { useState } from 'react';
import {
  Button,
  Container,
  Modal,
  Row
  // ToggleButton,
  // ToggleButtonGroup
} from 'react-bootstrap';

const HomeView: React.FC<{}> = () => {
  const [modalType /*, setModalType*/] = useState<'register' | 'login'>(
    'login'
  );
  const [userType /*, setUserType*/] = useState<'printer' | 'provider' | null>(
    null
  );

  // const isRegister = modalType === 'register';
  // const isLogin = modalType === 'login';
  const registerDisabled = modalType === 'register' && !userType;
  const buttonPreText = modalType === 'login' ? 'Sign In' : 'Sign Up';

  return (
    <Modal show size="lg" backdrop>
      <div className="p-3">
        <Modal.Header>
          <Modal.Title>
            {modalType === 'login' && 'Sign In'}
            {modalType === 'register' && 'Sign Up'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Choose one of the authentication methods below.</Modal.Body>
        <Modal.Footer>
          {/*
            modalType === 'register' &&
            <Container>
              <Row className="justify-content-md-center p-2">
                I am a...
              </Row>
              <Row className="justify-content-md-center p-2">
                <ToggleButtonGroup name="radio" type="radio" value={userType} onChange={setUserType}>
                  <ToggleButton value="printer" type="radio" name="radio" variant="outline-primary" className="mr-2 px-5">Printer</ToggleButton>{' '}
                  <ToggleButton value="provider" type="radio" name="radio" variant="outline-primary" className="px-5">Provider</ToggleButton>{' '}
                </ToggleButtonGroup>
              </Row>
            </Container>
            */}
          <Container>
            <Row className="justify-content-md-center p-2">
              <Button
                disabled={registerDisabled}
                variant="primary"
                href="/login/facebook"
                className="mr-2"
              >
                {buttonPreText} with Facebook
              </Button>{' '}
              <Button
                disabled={registerDisabled}
                variant="primary"
                href="/login/google"
              >
                {buttonPreText} with Google
              </Button>{' '}
            </Row>
          </Container>
          {/*
            <Container>
              <Row className="justify-content-md-center p-2">
                {actionMessage} <Button variant="link" onClick={() => setModalType(modalType === 'login' ? 'register' : 'login')} className="p-0 ml-1 font-weight-bold">{actionPreText} Now</Button>
              </Row>
            </Container>
          */}
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default HomeView;
