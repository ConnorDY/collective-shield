import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { Provider } from 'react-redux';

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
import RoleModal from './components/RoleModal';

const store = configureStore();

const App: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<User>();
  const [role, setRole] = useState<string | null>(
    sessionStorage.getItem('role')
  );

  // on app load
  useEffect(() => {
    // get user profile
    axios
      .get(buildEndpointUrl('me'))
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        history.push('/login');
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
                <HomeView user={user} role={role!} />
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

              <Route path="/request/:id" exact>
                <NewRequestView user={user} />
              </Route>

              {!role && <RoleModal setRole={setRole} />}
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
