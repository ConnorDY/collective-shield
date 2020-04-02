import React from 'react';

import User from '../models/User';
import { Col, Container, Row } from 'react-bootstrap';
import Avatar from './Avatar';

const Navbar: React.FC<{ user: User | undefined }> = ({ user }) => {
  return (
    <nav className="nav">
      <Container>
        <Row>
          <Col className="branding">
            <img 
              alt="Logo"
              className="logo" 
              src={require("../assets/img/navlogo.png")}
            ></img>
            <div>MaskShield</div>
          </Col>

          {user ?
            <Col className="user">
              <Row className="justify-content-end">
                <Col xs={4} className="my-auto font-weight-bold">{user.firstName}</Col>
                <Avatar user={user} />
              </Row>
            </Col>
            :
            <></>
          }
        </Row>
      </Container>
    </nav>
  );
};

export default Navbar;
