import React from 'react';
import { Col, Container, Row, Navbar, Nav } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { get } from 'lodash';

import User from '../models/User';
import Avatar from './Avatar';
import Logo from './Logo';

const MainNav: React.FC<{
  user: User | undefined;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ user, role, setRole }) => {
  const showAdmin = get(user, 'isSuperAdmin', false);
  const logoFill = ['default', 'blue-purple', 'orange', 'gray'];

  const oppositeRole = role === 'maker' ? 'requester' : 'maker';

  function switchRole() {
    setRole(oppositeRole);
  }

  return (
    <Navbar expand="lg" className="nav">
      <Container>
        <Row className="justify-content-end nav-inner no-gutters">
          <Col xs={12} lg={3}>
            <Navbar.Brand
              href="https://www.collectiveshield.org"
              className="branding"
            >
              <Logo height="150" width="250" fill={logoFill[2]} />
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
                        <>
                          <NavLink
                            exact
                            to="/"
                            activeClassName="active"
                            className="nav-link"
                          >
                            Work
                          </NavLink>

                          <NavLink
                            to="/requests"
                            activeClassName="active"
                            className="nav-link"
                          >
                            Requests
                          </NavLink>

                          <NavLink
                            to="/makers"
                            activeClassName="active"
                            className="nav-link"
                          >
                            Approvals
                          </NavLink>
                        </>
                      )}
                    </Nav>
                  )}
                </Col>

                <Col xs={12} lg={6} className="user text-lg-right">
                  {user ? (
                    <Navbar.Text className="my-auto font-weight-bold">
                      <span className="ml-lg-3 mr-3 my-auto">
                        {user.firstName}
                      </span>

                      <Avatar size="40" user={user} />

                      <Link
                        to="#"
                        onClick={() => switchRole()}
                        className="ml-lg-3 mr-3"
                      >
                        Switch to{' '}
                        {oppositeRole.charAt(0).toUpperCase() +
                          oppositeRole.slice(1)}
                      </Link>

                      <Link to="/logout">Logout</Link>
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
