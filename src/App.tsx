import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { Provider } from 'react-redux';
import { get } from 'lodash';

import configureStore from './store';
import { buildEndpointUrl } from './utilities';
import User from './models/User';
import HomeView from './views/HomeView';
import LoginView from './components/LoginView';
import MakerView from './components/MakerView';
import RequestListView from './components/RequestListView';
import NewRequestView from './components/NewRequestView';
import WorkView from './components/WorkView';

import './assets/scss/app.scss';
import Navbar from './components/Navbar';

const store = configureStore();

const App: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    axios
      .get(buildEndpointUrl('me'))
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        if (get(err, 'response.status') === 401) {
          history.push('/login');
          return null;
        }
      });
  }, []);

  return (
    <Provider store={store}>
      <Navbar user={user} />
      <main className="main">
        <Container>
          {user ? (
            <>
              <Route path="/" exact>
                <HomeView user={user} />
              </Route>

              <Route path="/makers">
                <MakerView />
              </Route>

              <Route path="/work">
                <WorkView user={user} />
              </Route>

              <Route path="/create/request">
                <NewRequestView user={user} />
              </Route>

              <Route path="/admin/requests">
                <RequestListView user={user} />
              </Route>
            </>
          ) : (
            <>
              <Route path="/login">
                <LoginView />
              </Route>
            </>
          )}
        </Container>
      </main>
    </Provider>
  );
};

export default App;
