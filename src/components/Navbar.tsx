import React from 'react';

import User from '../models/User';
import { Col, Container, Row } from 'react-bootstrap';

const Navbar: React.FC<{ user: User | undefined }> = ({ user }) => {
  return (
    <nav className="nav">
      <Container>
        <Row>
          <Col className="logo">
            <div>MaskShield</div>
          </Col>

          {user ? <Col className="user">{user.firstName}</Col> : <></>}
        </Row>
      </Container>
    </nav>
  );
};

export default Navbar;
