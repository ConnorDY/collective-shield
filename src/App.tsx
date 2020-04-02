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
import LoginView from './views/LoginView';
import MakerView from './views/MakerView';
import RequestView from './views/RequestView';
import RequestListView from './views/RequestListView';
// import NewRequestView from './components/NewRequestView';
import WorkView from './views/WorkView';

import './assets/scss/app.scss';
import Navbar from './components/Navbars/Navbar';

const store = configureStore()

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
              {/* <Route path="/" exact component={NewRequestView} /> */}
              <Route path="/" exact>
                <HomeView user={user} />
              </Route>

              <Route path="/makers">
                <MakerView />
              </Route>

              <Route path="/requests" exact>
                <RequestView />
              </Route>

              <Route path="/work">
                <WorkView user={user} />
              </Route>

              <Route path="/requests/all">
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
