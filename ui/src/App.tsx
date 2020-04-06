import React, { useEffect, useState } from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

import configureStore from './store';
import { buildEndpointUrl } from './utilities';
import User from './models/User';
import Navbar from './components/Navbar';
import Footer from './components/Footers/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import LogoutView from './views/LogoutView';
import MakerView from './views/MakerView';
import RequestListView from './views/RequestListView';
import RequestFormView from './views/RequestFormView';
import ErrorView from './views/ErrorView';

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
      <div id="headerAndMain">
        <Navbar user={user} />

        <ScrollToTop>
          <main className="main">
            <Container className="inner">
              {user ? (
                <>
                  <Switch>
                    <Route path="/" exact>
                      <HomeView user={user} role={role!} />
                    </Route>

                    <Route path="/request" exact>
                      <RequestFormView user={user} />
                    </Route>

                    <Route path="/requests" exact>
                      <RequestListView user={user} />
                    </Route>

                    <Route path="/request/:id" exact>
                      <RequestFormView user={user} />
                    </Route>

                    <Route path="/makers" exact>
                      <MakerView />
                    </Route>

                    <Route path="/logout" exact>
                      <LogoutView />
                    </Route>

                    <Route path="*">
                      <ErrorView />
                    </Route>
                  </Switch>

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
        </ScrollToTop>
      </div>

      <Footer />

      <ToastContainer />
    </Provider>
  );
};

export default App;
