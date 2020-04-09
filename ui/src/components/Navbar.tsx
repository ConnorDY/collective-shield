import React from 'react';
import { Col, Container, Row, Navbar, Nav } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { get } from 'lodash';

import User from '../models/User';
import Avatar from './Avatar';
import Logo from './Logo';

const MainNav: React.FC<{ user: User | undefined }> = ({ user }) => {
  const showAdmin = get(user, 'isSuperAdmin', false);
  const logoFill = ['default', 'blue-purple', 'orange', 'gray'];

  return (
    <Navbar expand="lg" className="nav">
      <Container>
        <Row className="justify-content-end nav-inner no-gutters">
          <Col xs={12} lg={3}>
            <Navbar.Brand href="/" className="branding">
              <Logo height="30" width="30" fill={logoFill[1]} />
              <span
                className={`align-middle logo-text logo-text-${logoFill[0]}`}
              >
                Collective Shield
              </span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav-bar" />
          </Col>
          <Col xs={12} lg={9}>
            <Navbar.Collapse
              id="main-nav-bar"
              className="justify-content-between"
            >
              <Row className="collapse-row no-gutters">
                <Col xs={12} lg={6} className="nav-links">
                  {user && (
                    <Nav className="mr-auto text-lg-center">
                      {showAdmin && (
                        <NavLink
                          to="/requests"
                          activeClassName="active"
                          className="nav-link"
                        >
                          Admin
                        </NavLink>
                      )}
                    </Nav>
                  )}
                </Col>
                <Col xs={12} lg={6} className="user text-lg-right">
                  {user ? (
                    <Navbar.Text className="my-auto  font-weight-bold">
                      <span className="ml-lg-3 mr-3 my-auto">
                        {user.firstName}
                      </span>
                      <Avatar size="40" user={user} />
                      <Link to="/logout" className="ml-lg-3 my-lg-auto">
                        Logout
                      </Link>
                    </Navbar.Text>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
            </Navbar.Collapse>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default MainNav;
