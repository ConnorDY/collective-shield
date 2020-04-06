import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Footer: React.FC<{}> = () => {
  return (
    <footer id="footer">
      <Container>
        <Row>
          <Col>© {new Date().getFullYear()} Collective Shield</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
