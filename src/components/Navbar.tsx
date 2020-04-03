import React from 'react';

import User from '../models/User';
import { Col, Container, Row } from 'react-bootstrap';
import Avatar from './Avatar';

const Navbar: React.FC<{ user: User | undefined }> = ({ user }) => {
  return (
    <nav className="nav">
      <Container>
        <Row>
          <Col className="logo">
            <div>MaskShield</div>
          </Col>

          {user ? (
            <Col className="user">
              <Row className="justify-content-end">
                <Col xs={4} className="my-auto font-weight-bold">
                  {user.firstName}
                </Col>
                <Avatar size="40" user={user} />
              </Row>
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </Container>
    </nav>
  );
};

export default Navbar;
