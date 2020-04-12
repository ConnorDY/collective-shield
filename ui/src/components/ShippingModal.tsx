import React, { useState } from 'react';
import { Button, Modal, ListGroup } from 'react-bootstrap';

const ShippingModal: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Get Shipping Label
      </Button>
      <Modal show={show} size="lg" backdrop onHide={handleClose}>
        <div className="p-3">
          <Modal.Header closeButton>
            <Modal.Title>Need shipping labels?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ListGroup as="ol">
              <ListGroup.Item as="li">
                Contact the requester to obtain their shipping address.
              </ListGroup.Item>
              <ListGroup.Item as="li">
                Email{' '}
                <a href="mailto: support@collectiveshield.org">
                  support@collectiveshield.org
                </a>{' '}
                with the requester's shipping address.
              </ListGroup.Item>
            </ListGroup>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default ShippingModal;
