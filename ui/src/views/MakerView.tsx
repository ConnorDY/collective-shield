import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { buildEndpointUrl } from '../utilities';
import Maker from '../models/Maker';

export default function MakerView() {
  const history = useHistory();
  const [makers, setMakers] = useState<Maker[]>([]);

  function getMakers() {
    axios
      .get(buildEndpointUrl(`makers`))
      .then((res) => {
        setMakers(res.data);
      })
      .catch((err) => {
        if (err.response != null && err.response.status === 401) {
          return history.push('/login');
        }
        console.error(err);
      });
  }

  useEffect(() => {
    getMakers();
  }, []);

  if (!makers || !makers.length) {
    return null;
  }

  return (
    <div>
      <div className="container">
        <div className="c-intro">
          <h1>Maker List</h1>
        </div>
      </div>
      <div className="c-makers container">
        {makers === null || makers.length === 0 ? (
          <div className="c-makers__items -none">No makers found</div>
        ) : (
          <div className="c-makers__items">
            <div className="c-makers__item -header">
              <div>Name</div>
              <div>Email</div>
              <div>Total Prints</div>
            </div>
            {makers.map((maker, key) => {
              return (
                <div key={key} className="c-makers__item">
                  <div>{maker.name}</div>
                  <div>{maker.email}</div>
                  <div>{maker.prints}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
