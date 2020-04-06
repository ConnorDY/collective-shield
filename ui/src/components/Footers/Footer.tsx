import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Footer: React.FC<{}> = () => {
  return (
    <footer className="footer footer-default">
      <Container>
        <Row>
          <Col className="footer">
            <div className="copyright">
              © {new Date().getFullYear()} Collective Shield
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
