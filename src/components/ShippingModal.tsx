import React, { useState } from 'react';
import { Button, Container, Modal, Row } from 'react-bootstrap';

const ShippingModal: React.FC = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Shipping Info
      </Button>
      <Modal show={show} size="lg" backdrop onHide={handleClose}>
        <div className="p-3">
          <Modal.Header closeButton>
            <Modal.Title>Need shipping labels?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>1. Contact the requestor to obtain their shipping address.</p>
            <p>
              2. Email <a href="mailto: Jeffrey@collectiveshield.org">Jeffrey@collectiveshield.org</a> with the requestor's shipping address.
            </p>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default ShippingModal;
