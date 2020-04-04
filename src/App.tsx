import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { Provider } from 'react-redux';
import { get } from 'lodash';

import configureStore from './store';
import { buildEndpointUrl } from './utilities';
import User from './models/User';
import Navbar from './components/Navbar';
import Footer from './components/Footers/Footer';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import MakerView from './views/MakerView';
import RequestListView from './views/RequestListView';
import NewRequestView from './views/NewRequestView';
import WorkView from './views/WorkView';

import './assets/scss/app.scss';
import MyRequestsView from './views/MyRequestsView';

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
        <Container className="inner">
          {user ? (
            <>
              <Route path="/" exact>
                <HomeView user={user} />
              </Route>

              <Route path="/home">
                <HomeView user={user} />
              </Route>

              <Route path="/work" exact>
                <WorkView user={user} />
              </Route>

              <Route path="/request" exact>
                <NewRequestView user={user} />
              </Route>

              <Route path="/requests" exact>
                <RequestListView user={user} />
              </Route>

              <Route path="/makers" exact>
                <MakerView />
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
      <Footer /> 
    </Provider>
  );
};

export default App;
