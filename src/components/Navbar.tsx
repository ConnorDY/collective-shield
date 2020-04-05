import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";

import User from '../models/User';
import Avatar from './Avatar';
import navLogo from '../assets/img/navlogo.png';

const Navbar: React.FC<{ user: User | undefined }> = ({ user }) => {
  return (
    <nav className="nav">
      <Container>
        <Row>
          <Col className="branding">
            <img alt="Logo" className="logo" src={navLogo}></img>
            <div>Collective Shield</div>
          </Col>

          {user ? (
            <Col className="user">
              <Row className="justify-content-end">
                <Col xs={4} className="my-auto font-weight-bold">
                  {user.firstName}
                </Col>
                <Avatar size="40" user={user} />
                <Col xs={1} className="my-auto ml-3 font-weight-bold">
                  <Link to="/logout">Logout</Link>
                </Col>
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
