import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Jumbotron } from 'react-bootstrap';
import axios from 'axios';
import { get, lowerCase } from 'lodash';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import User from '../models/User';
import Product from '../models/Product';
import { buildEndpointUrl } from '../utilities';

const ProductListView: React.FC<{ user: User; role: string }> = ({ user, role }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  let searchResults: any[] = [];

  const isMakerView = role === 'maker';
  const isAdminView = !!user.isSuperAdmin;

  function getAllProducts() {
    const endpoint = isAdminView ? 'products/all' : 'products/available';
    axios.get(buildEndpointUrl(endpoint)).then((res) => {
      setAllProducts(res.data);
    });
  }
  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // on load
  useEffect(() => {
    getAllProducts();
  }, []);

  if (allProducts.length) {
    const keys = [
      'name',
      'description'
    ];

    const results = allProducts.filter((m) => {
      return (
        keys.some((k) => {
          return lowerCase(get(m, k, '')).includes(lowerCase(searchTerm || ''));
        })
      );
    });
    searchResults = results;
  }

  return (
    <div className="all-requests">
      <Row className="view-header">
        <Col>
          <h1 className="h1">Products</h1>
        </Col>
        <Col className="searchInput">
          <input
            type="text"
            placeholder="Search by name or description"
            value={searchTerm}
            onChange={handleChange}
          />
        </Col>
        {
          isAdminView &&
          <Col className="right-col my-auto col-md-auto text-sm-right">
            <Link to="/product">
              <Button>
                New Product
              </Button>
            </Link>
          </Col>
        }
      </Row>

      <Row>
        {(!allProducts || allProducts.length === 0) && (
          <Col>
            <Jumbotron className="text-center">No products found.</Jumbotron>
          </Col>
        )}

        {allProducts && allProducts.length > 0 && (
          <Col>
            <div className="table-wrapper">
              <table className="requested-list-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    {
                      !isAdminView && !isMakerView &&
                        <th>Description</th>
                    }
                    {
                      (isAdminView || isMakerView) &&
                        <>
                          <th>Packing Instructions</th>
                          <th>3D Model</th>
                          <th>Available</th>
                        </>
                    }
                    <th>Image</th>
                    {
                      !isAdminView && !isMakerView &&
                        <th>Action</th>
                    }
                  </tr>
                </thead>

                <tbody>
                  {searchResults.map((r) => (
                    <tr key={r._id}>
                      <td className="font-weight-bold" style={{ width: '20%' }}>
                        <Link to={`/product/${r._id}`}>{r.name}</Link>
                      </td>
                      {
                        !isAdminView && !isMakerView &&
                        <td style={{ width: '70%' }}>
                          {r.description.substring(0,150)}
                          {r.description.length >= 150 && '...'}
                        </td>
                      }
                      {
                        (isAdminView || isMakerView) &&
                          <>
                            <td>
                              <a href={r.packingUrl} target="_blank">View packing instructions</a>
                            </td>
                            <td>
                              <a href={r.modelUrl} target="_blank">View 3D model</a>
                            </td>
                            <td>
                              {!r.isArchived ? (
                                <FontAwesomeIcon
                                  className="green-checkmark"
                                  icon={faCheck}
                                />
                              ) : (
                                <FontAwesomeIcon className="red-x" icon={faTimes} />
                              )}
                            </td>
                          </>
                      }
                      <td>
                        <img
                          height="70px"
                          alt={r.name}
                          src={r.imageUrl || '/placeholder.png'}
                        />
                      </td>
                      {
                        !isAdminView && !isMakerView &&
                        <td>
                          <Link to={`/request/product/${r._id}`}>
                            <Button variant="info" disabled={r.isArchived}>Request</Button>
                          </Link>
                        </td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ProductListView;
