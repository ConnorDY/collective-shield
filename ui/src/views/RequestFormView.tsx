import React, { useEffect, useState, BaseSyntheticEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useParams } from 'react-router';
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  Form,
  Row,
  Spinner
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { compact, find, get, orderBy, pick, uniqBy } from 'lodash';

import Product from '../models/Product';
import User from '../models/User';
import StatusOption from '../components/StatusOption';
import ShippingModal from '../components/ShippingModal';
import { buildEndpointUrl, readCookie, scrollToTop } from '../utilities';
import { states, statuses } from '../utilities/constants';

const RequestFormView: React.FC<{ user: User; role: string }> = ({
  user,
  role
}) => {
  const history = useHistory();
  let { id } = useParams();

  const [isCreated, setIsCreated] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [productsIsLoading, setProductsIsLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  // Request Details
  const [detailsReq, setDetailsReq] = useState({
    maskShieldCount: 1,
    details: '',
    jobRole: '',
    otherJobRole: '',
    email: '',
    facilityName: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    phone: '',
    status: '',
    makerID: '',
    requestorID: '',
    homePickUp: false,
    makerNotes: '',
    productID: '',
    doesAgree: false,
  });

  const roleOptions = [
    'Healthcare Worker',
    'First Responder',
    'Critical Workforce',
    'Delivery or Retail',
    'Military',
    'Other'
  ];

  const isMakerView = role === 'maker';
  const isAdminView = !!user.isSuperAdmin;

  const isExisting = !!id;
  const disabled = !!isExisting && !isAdminView;
  const selectedProduct = find(products, p => p['_id'] === detailsReq.productID) || { imageUrl: '', _id: '', name: '' };

  function updateDetailsReq(data: object) {
    setDetailsReq({
      ...detailsReq,
      ...data
    });
  }

  function updateProducts(data: Product[] = []) {
    setProducts(prev => orderBy(compact(uniqBy([...prev, ...data], '_id')), '_id'));
  }

  function getDetails() {
    axios.get(buildEndpointUrl(`requests/${id}`)).then((res) => {
      updateDetailsReq(res.data);
      const product = get(res, 'data.product', {});
      updateProducts([product]);
    });
  }

  function getProducts() {
    setProductsIsLoading(true);
    axios.get(buildEndpointUrl('products/available')).then((res) => {
      updateProducts(res.data);
      const firstProduct = get(orderBy(res.data, '_id'), '[0]._id', '');
      if (!isExisting) updateDetailsReq({ productID: firstProduct });
      // force some loading time so that there isn't a flicker
      setTimeout(() => {
        setProductsIsLoading(false);
      }, 300);
    });
  }

  function setStatus(status: string) {
    axios
      .patch(buildEndpointUrl(`requests/${id}/${status}`))
      .then(() => {
        updateDetailsReq({ status });
      })
      .catch((err) => {
        toast.error(err.toString(), {
          position: toast.POSITION.TOP_LEFT
        });
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
        'maskShieldCount',
        'details',
        'jobRole',
        'otherJobRole',
        'email',
        'facilityName',
        'firstName',
        'lastName',
        'addressLine1',
        'addressLine2',
        'addressCity',
        'addressState',
        'addressZip',
        'phone',
        'homePickUp',
        'makerNotes',
        'productID',
      ]);
      // TODO - update to allow /maker-details to accept only necessary fields
      // https://github.com/ConnorDY/collective-shield/pull/117#issuecomment-614034590

      const routeSuffix = isMakerView && !isAdminView ? 'maker-details' : '';
      const endpoint = isExisting
        ? `requests/${id}/${routeSuffix}`
        : 'requests';
      const method = isExisting ? 'patch' : 'post';

      axios[method](buildEndpointUrl(endpoint), data)
        .then(() => {
          if (isExisting) {
            toast.success('Successfully updated!', {
              position: toast.POSITION.TOP_LEFT
            });
          } else {
            setIsCreated(true);
            scrollToTop();
          }
        })
        .catch((err) => {
          toast.error(err.toString(), {
            position: toast.POSITION.TOP_LEFT
          });
        });
    }
  }

  function cancel() {
    history.push('/');
  }

  // on load
  useEffect(() => {
    axios.defaults.headers.post['CSRF-Token'] = readCookie('XSRF-TOKEN');
    getProducts();
    if (id) getDetails();
  }, []);

  let h1 = 'New Request';
  if (isExisting) h1 = 'Request Details';
  if (isCreated) h1 = 'Thank You!';

  return (
    productsIsLoading ?
    <Row className="justify-content-md-center">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Row>
    :
    <div className="request-details">
      <Row className="view-header">
        <Col>
          <h1 className="h1">{h1}</h1>
        </Col>

        <Col sm={7} className="right-col">
          <Row>
            {isExisting && (isMakerView || isAdminView) && (
              <>
                <Col className="col-auto">
                  <ShippingModal request={detailsReq as any} />
                </Col>

                <Col className="col-auto">
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      id="details-status-dropdown"
                      variant="outline-secondary"
                    >
                      {StatusOption(detailsReq.status || 'Requested')}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {statuses.map((status) => (
                        <Dropdown.Item
                          key={`status-${status}`}
                          onClick={() => setStatus(status)}
                        >
                          {StatusOption(status)}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </>
            )}

            {isExisting && !isMakerView && !isAdminView && (
              <Col className="col-auto">{StatusOption(detailsReq.status)}</Col>
            )}

            <Col className="col-auto">
              <Button onClick={history.goBack}>Go back</Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {isMakerView && (
        <Row className="view-header">
          <Col>
            <p>
              Please update the status of your job to keep the requester
              apprised of your progress using the drop-down menu in the upper
              right corner of this screen.
            </p>
            <p>
              When your job is complete, either email the requester directly to
              arrange transfer or select "Get Shipping Label" and Collective
              Shield will email a pre-paid label to you. Don’t forget to include
              the{' '}
              <a href="/PrintInsert_20200406.pdf" target="_blank">
                shipping insert
              </a>{' '}
              in your package.
            </p>
          </Col>
        </Row>
      )}

      {isCreated ? (
        <Row>
          <Col>
            <div className="c-requestForm -pad">
              <Alert variant="success">
                <div style={{ fontSize: '1.2em' }}>
                  Check back in to track the progress of your request.{' '}
                  <Link to="/">View and Follow Your Requests.</Link>
                </div>
              </Alert>
            </div>
          </Col>
        </Row>
      ) : (
        <>
        <Form
          noValidate
          validated={isValidated}
          onSubmit={(e: React.BaseSyntheticEvent) => {
            handleSubmit(e);
          }}
        >
          <Row id="requested-row-2">
            <Col>
              <h4>Requester Contact Information</h4>
                <Form.Group controlId="formBasicJobTitle">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    as="select"
                    required
                    value={detailsReq.jobRole}
                    onChange={(e: BaseSyntheticEvent) =>
                      // reset otherJobRole on change
                      updateDetailsReq({
                        jobRole: e.target.value,
                        otherJobRole: ''
                      })
                    }
                  >
                    <option value={''}>Select your Role</option>
                    {roleOptions.map((role) => {
                      return <option key={`role-${role}`}>{role}</option>;
                    })}
                  </Form.Control>
                </Form.Group>

                {detailsReq.jobRole === 'Other' && (
                  <Form.Group controlId="formBasicOtherRole">
                    <Form.Label>Other Job Role</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required // Actually only required when detailsReq.jobRole === 'Other'
                      type="text"
                      value={detailsReq.otherJobRole}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ otherJobRole: e.target.value })
                      }
                    />
                  </Form.Group>
                )}

                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Preferred Email Address</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    required
                    type="email"
                    value={detailsReq.email}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ email: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formBasicFacilityName">
                  <Form.Label>Organization (Optional)</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    type="text"
                    value={detailsReq.facilityName}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ facilityName: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
                      value={detailsReq.firstName}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ firstName: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
                      value={detailsReq.lastName}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ lastName: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Group controlId="formBasicAddressLine1">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    required
                    value={detailsReq.addressLine1}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ addressLine1: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formBasicAddressLine2">
                  <Form.Label>Address Line 2 (Optional)</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    value={detailsReq.addressLine2}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ addressLine2: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Row>
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
                      value={detailsReq.addressCity}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ addressCity: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
                      as="select"
                      value={detailsReq.addressState}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ addressState: e.target.value })
                      }
                    >
                      <option value={''}>Choose...</option>
                      {states.map((state) => (
                        <option key={`state-${state}`}>{state}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      disabled={disabled}
                      required
                      value={detailsReq.addressZip}
                      pattern="[0-9]{5}"
                      onChange={(e: BaseSyntheticEvent) => {
                        if (/^\d{0,5}$/.test(e.target.value)) {
                          updateDetailsReq({ addressZip: e.target.value });
                        } else e.preventDefault();
                      }}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Group controlId="formBasicPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    disabled={disabled}
                    required
                    value={detailsReq.phone}
                    pattern="[0-9-]{10,12}"
                    onChange={(e: BaseSyntheticEvent) => {
                      if (/^[0-9-]{0,12}$/.test(e.target.value)) {
                        updateDetailsReq({ phone: e.target.value });
                      } else e.preventDefault();
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicCheckboxHomePickUp">
                  <Form.Check
                    disabled={disabled}
                    checked={detailsReq.homePickUp}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ homePickUp: e.target.checked })
                    }
                    type="checkbox"
                    label={
                      <span>
                        I'm willing to be contacted by a local printer for
                        in-person delivery.
                      </span>
                    }
                  />
                </Form.Group>
                {
                  !isExisting &&
                  <Form.Group controlId="formBasicCheckboxDoesAgree">
                    <Form.Check
                      required
                      checked={detailsReq.doesAgree}
                      onChange={(e: BaseSyntheticEvent) =>
                        updateDetailsReq({ doesAgree: e.target.checked })
                      }
                      type="checkbox"
                      label={
                        <span>
                          I have accept the limitations of this product. Click on
                          this link{' '}
                          <a
                            href="https://collectiveshield.org/limitations"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Product Limitations"
                          >
                            this link
                          </a>
                          {' '}to read the product limitations.
                        </span>
                      }
                    />
                  </Form.Group>
                }
            </Col>

            <Col>
              <h4>Product</h4>
              <Form.Group controlId="formBasicProduct">
                <Form.Label>Select a Product</Form.Label>
                <Form.Control
                  disabled={disabled}
                  as="select"
                  required
                  value={detailsReq.productID}
                  onChange={(e: BaseSyntheticEvent) =>
                    // reset otherJobRole on change
                    updateDetailsReq({
                      productID: e.target.value
                    })
                  }
                >
                  {isExisting && <option disabled value="">No product selected</option>}
                  {products.map((product) => {
                    return <option value={get(product, '_id')} key={get(product, '_id')}>{get(product, 'name')}</option>;
                  })}
                </Form.Control>
                {
                  selectedProduct.imageUrl && selectedProduct._id &&
                    <a href={`/product/${selectedProduct._id}`} target="_blank">
                      <img
                        alt={selectedProduct.name}
                        className="pt-3"
                        src={selectedProduct.imageUrl || '/placeholder.png'}
                        height="120px"
                      />
                    </a>
                }
              </Form.Group>

              <h4>Number Requested</h4>
                <Form.Group>
                  <Form.Control
                    required
                    disabled={disabled}
                    type="number"
                    custom
                    id="requested-mask-shields-card"
                    value={detailsReq.maskShieldCount}
                    onChange={(e: BaseSyntheticEvent) => {
                      // Allow range of 0 to 10000. 0 will still cause server-side error,
                      // but makes the number input easier to change.
                      let value = e.target.value;
                      if (value < 0) value = 0;
                      if (value > 10000) value = 10000;
                      updateDetailsReq({ maskShieldCount: value });
                    }}
                  />
                </Form.Group>
              {detailsReq.maskShieldCount >= 50 && !isExisting && (
                <Alert variant="info">
                  For this request size, you will also need to email us at{' '}
                  <a href="mailto:support@collectiveshield.org">
                    support@collectiveshield.org
                  </a>{' '}
                  after you submit your request.
                </Alert>
              )}

              <h4>Request Details</h4>
              <h5>Add any details or comments about the request here</h5>
                <Form.Group controlId="requestDetails">
                  <Form.Control
                    disabled={disabled}
                    as="textarea"
                    rows="6"
                    value={detailsReq.details}
                    onChange={(e: BaseSyntheticEvent) =>
                      updateDetailsReq({ details: e.target.value })
                    }
                  />
                </Form.Group>

              {isExisting && (
                <>
                  <h4>Maker Notes</h4>
                  <h5>Makers can add notes here, which are also visible to the requester</h5>
                    <Form.Group controlId="requestMakerNotes">
                      <Form.Control
                        disabled={disabled && !isMakerView}
                        as="textarea"
                        rows="6"
                        value={detailsReq.makerNotes}
                        onChange={(e: BaseSyntheticEvent) =>
                          updateDetailsReq({ makerNotes: e.target.value })
                        }
                      />
                    </Form.Group>
                  {
                    isMakerView &&
                      <Alert variant="info">
                        Ensure that you click the "Update Request" button when are you done updating notes.
                      </Alert>
                  }
                </>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              {(!isExisting || isMakerView || isAdminView) && (
                <div id="request-button-group">
                  <Button variant="primary" type="submit">
                    {isExisting ? 'Update Request' : 'Submit Request'}
                  </Button>

                  {!isExisting && (
                    <Button
                      variant="light"
                      id="cancel-request-button"
                      onClick={cancel}
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>
              )}
            </Col>
          </Row>
          </Form>
        </>
      )}
    </div>
  );
};

export default RequestFormView;
