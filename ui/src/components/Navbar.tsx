import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
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
          <Col className="branding">
            <Link to="/">
              <>
                <img alt="Logo" className="logo" src={navLogo}></img>
                <div>Collective Shield</div>
              </>
            </Link>
          </Col>

          {user && (
            <Col xs={6}>
              <Row>
                <Col className="my-auto font-weight-bold text-center">
                  {showAdmin && (
                    <NavLink
                      to="/requests"
                      activeClassName="active"
                      className="nav-link"
                    >
                      Admin
                    </NavLink>
                  )}
                </Col>
              </Row>
            </Col>
          )}

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
