import React, { useState } from 'react';
import { Button, Modal, ListGroup } from 'react-bootstrap';

import Request from '../models/Request';

const ShippingModal: React.FC<{ request: Request }> = ({ request }) => {
  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  function handleShow() {
    setShow(true);
  }

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
                <pre className="mb-0">
                  {`${request.firstName} ${request.lastName}\n`}
                  {`${request.addressLine1}\n`}
                  {request.addressLine2 ? `${request.addressLine2}\n` : ''}
                  {`${request.addressCity}, ${request.addressState} ${request.addressZip}`}
                </pre>
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
