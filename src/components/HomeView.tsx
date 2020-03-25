import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Navbar';
import WorkView from './WorkView';
import MyRequestsView from './MyRequestsView';
import { buildEndpointUrl } from '../Utilities';

export default function HomeView() {
  const history = useHistory();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios
      .get(buildEndpointUrl('me'))
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        if (err.response != null && err.response.status === 401) {
          return history.push('/login');
        }
        console.error(err);
      });
  }, []);

  if (user === null) {
    return null;
  }

  if (user.maker !== null) {
    return <WorkView user={user} />;
  }

  if (!user.isSuperAdmin) {
    return <MyRequestsView user={user} />;
  }

  return (
    <div>
      <Navbar activePage="home" />

      <div className="container">
        <div className="c-intro">
          <h1>Welcome, Phil</h1>
          <p>Content here</p>
        </div>
      </div>
    </div>
  );
}
