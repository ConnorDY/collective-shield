import React, { useEffect, useState, BaseSyntheticEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import {
  Alert,
  Button,
  Col,
  Form,
  Row
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { get, pick } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import User from '../models/User';
import { buildEndpointUrl, readCookie, scrollToTop } from '../utilities';

const ProductFormView: React.FC<{ user: User, role: string }> = ({
  user,
  role
}) => {
  let { id } = useParams();
  const history = useHistory();

  const [isCreated, setIsCreated] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [createdId, setCreatedId] = useState('');

  // Product Details
  const [detailsReq, setDetailsReq] = useState({
    _id: '',
    name: '',
    description: '',
    imageUrl: '',
    packingUrl: '',
    modelUrl: '',
    isArchived: false
  });

  const isMakerView = role === 'maker';
  const isAdminView = user.isSuperAdmin;

  const isExisting = !!id;
  const disabled = !!isExisting && !isAdminView;

  function updateDetailsReq(data: object) {
    setDetailsReq({
      ...detailsReq,
      ...data
    });
  }

  function getDetails() {
    axios.get(buildEndpointUrl(`products/${id}`)).then((res) => {
      updateDetailsReq(res.data);
    });
  }

  function handleSubmit(event: React.BaseSyntheticEvent) {
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      setIsValidated(true);
    } else {
      event.preventDefault();
      setIsValidated(true);

      const data = pick(detailsReq, [
        'name',
        'description',
        'imageUrl',
        'packingUrl',
        'modelUrl',
        'isArchived'
      ]);
      let endpoint = 'products';
      if (isExisting) endpoint = `${endpoint}/${id}`;
      const method = isExisting ? 'patch' : 'post';

      axios
        [method](buildEndpointUrl(endpoint), data)
        .then((res) => {
          if (isExisting) {
            toast.success('Successfully updated!', {
              position: toast.POSITION.TOP_LEFT
            });
          } else {
            setCreatedId(get(res, 'data._id'));
            setIsCreated(true);
            scrollToTop();
          }
        })
        .catch((err: any) => {
          toast.error(err.toString(), {
            position: toast.POSITION.TOP_LEFT
          });
        });
    }
  }

  // on load
  useEffect(() => {
    axios.defaults.headers.post['CSRF-Token'] = readCookie('XSRF-TOKEN');

    if (id) getDetails();
  }, []);

  let h1 = 'New Product';
  if (isExisting) h1 = 'Product Details';
  if (isCreated) h1 = 'Product Updated';

  return (
    <div className="request-details product-details">
      <Row className="view-header">
        <Col>
          <h1 className="h1">{h1}</h1>
        </Col>
      </Row>

      {isCreated ? (
        <Row>
          <Col>
            <div className="c-requestForm -pad">
              <Alert variant="success">
                <div style={{ fontSize: '1.2em' }}>
                  <span>Product was successfully created. View your new product by{' '}</span>
                  <Link to={`/product/${createdId}`}>clicking here.</Link>
                </div>
              </Alert>
            </div>
          </Col>
        </Row>
      ) : (
        <>
          <Row id="requested-row-2">
            <Col>
              <Form
                noValidate
                validated={isValidated}
                onSubmit={(e: React.BaseSyntheticEvent) => {
                  handleSubmit(e);
                }}
              >
                <Form.Group controlId="formBasicName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    required
                    disabled={disabled}
                    type="text"
                    value={detailsReq.name}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ name: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formBasicDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    as="textarea"
                    rows="4"
                    value={detailsReq.description}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ description: e.target.value })
                    }
                  />
                </Form.Group>

                {
                  isAdminView &&
                  <Form.Group controlId="formBasicImageUrl">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      type="text"
                      value={detailsReq.imageUrl}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ imageUrl: e.target.value })
                      }
                    />
                  </Form.Group>
                }

                {
                  (isMakerView || isAdminView) &&
                  <>
                    <Form.Group controlId="formBasicPackingUrl">
                      <Form.Label>Packing Details URL</Form.Label>
                      <Row>
                        <Col xs={11}>
                          <Form.Control
                            disabled={disabled}
                            type="text"
                            value={detailsReq.packingUrl}
                            onChange={(e: BaseSyntheticEvent) =>
                              updateDetailsReq({ packingUrl: e.target.value })
                            }
                          />
                        </Col>
                        <Col xs={1} className="pl-0">
                          <Button className="pl-0" href={detailsReq.packingUrl} variant="link" title="Packing Instructions">
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                            />
                          </Button>
                        </Col>
                      </Row>
                    </Form.Group>

                    <Form.Group controlId="formBasicModelUrl">
                      <Form.Label>3D Model Details URL</Form.Label>

                      <Row>
                        <Col xs={11}>
                          <Form.Control
                            disabled={disabled}
                            type="text"
                            value={detailsReq.modelUrl}
                            onChange={(e: BaseSyntheticEvent) =>
                              updateDetailsReq({ modelUrl: e.target.value })
                            }
                          />
                        </Col>
                        <Col xs={1} className="pl-0">
                          <Button className="pl-0" href={detailsReq.modelUrl} variant="link" title="3D Model URL">
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                            />
                          </Button>
                        </Col>
                      </Row>
                    </Form.Group>
                  </>
                }

                {
                  isAdminView &&
                  <Form.Group controlId="formBasicCheckboxIsArchived">
                    <Form.Label>Archive Status</Form.Label>
                    <Form.Check
                      disabled={disabled}
                      checked={detailsReq.isArchived}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ isArchived: e.target.checked })
                      }
                      type="checkbox"
                      label={
                        <span>
                          Checked box indicates that this product is archived and not available for new requests.
                        </span>
                      }
                    />
                  </Form.Group>
                }

                {
                  !isAdminView && detailsReq.isArchived &&
                  <Alert variant="danger">This product has been archived and is no longer available to request.</Alert>
                }

                {(!isExisting || isAdminView) && (
                  <div id="request-button-group">
                    <Button variant="primary" type="submit">
                      {isExisting ? 'Update Product' : 'Create Product'}
                    </Button>
                  </div>
                )}
              </Form>

              {
                !isAdminView && !isMakerView && !detailsReq.isArchived &&
                <div className="mt-5">
                  <Link to={`/request/product/${detailsReq._id}`}>
                    <Button variant="info">Request this product</Button>
                  </Link>
                </div>
              }
            </Col>
            <Col>
              <img src={detailsReq.imageUrl || '/placeholder.png'} width="100%" />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProductFormView;
