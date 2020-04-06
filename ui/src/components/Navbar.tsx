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
            <Col md={6} className="nav-lnks">
              <Row>
                <Col
                  xs={12}
                  className="my-auto font-weight-bold text-md-center"
                >
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
            <Col md={4} className="user">
              <Row>
                <Col xs={12} className="my-auto text-md-right font-weight-bold">
                  <span className="ml-3 mr-3">{user.firstName}</span>
                  <Avatar size="40" user={user} />
                  <Link to="/logout" className="ml-5">
                    Logout
                  </Link>
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
