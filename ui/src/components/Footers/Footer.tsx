import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Footer: React.FC<{}> = () => {
  return (
    <footer id="footer">
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={4} lg={3}>© {new Date().getFullYear()} Collective Shield</Col>
          <Col xs={12} lg={4}>Contact us at <a href="mailto:support@collectiveshield.org">support@collectiveshield.org</a></Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
