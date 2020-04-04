import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { get } from 'lodash';

import User from '../models/User';
import Avatar from './Avatar';
import navLogo from '../assets/img/navlogo.png';

const Navbar: React.FC<{ user: User | undefined }> = ({ user }) => {
  const showAdmin = get(user, 'isSuperAdmin', false);
  return (
    <nav className="nav">
      <Container>
        <Row>
          <Col xs={3} className="branding">
            <Link to="/">
              <>
                <img alt="Logo" className="logo" src={navLogo}></img>
                <div>MaskShield</div>
              </>
            </Link>
          </Col>

          {
            user &&
            <Col xs={5}>
              <Row className="justify-content-left">
                <Col xs={4} className="my-auto font-weight-bold">
                  <Link to="/">Request shields</Link>
                </Col>
                <Col xs={4} className="my-auto font-weight-bold">
                  <Link to="/work">Print shields</Link>
                </Col>
                {
                  showAdmin &&
                    <Col xs={4} className="my-auto font-weight-bold">
                      <Link to="/requests">Admin</Link>
                    </Col>
                }
              </Row>
            </Col>
          }

          {user ? (
            <Col xs={4} className="user">
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
