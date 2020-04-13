import React, { useEffect, useState } from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import Analytics from 'react-router-ga';

import configureStore from './store';
import { buildEndpointUrl } from './utilities';
import User from './models/User';
import Navbar from './components/Navbar';
import Footer from './components/Footers/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import LogoutView from './views/LogoutView';
import MakerVerificationPendingView from './views/MakerVerificationPendingView';
import MakerVerificationView from './views/MakerVerificationView';
import MakersView from './views/MakersView';
import RequestListView from './views/RequestListView';
import RequestFormView from './views/RequestFormView';
import ErrorView from './views/ErrorView';

import './assets/scss/app.scss';
import RoleModal from './components/RoleModal';

const store = configureStore();

const GA_KEY = process.env.REACT_APP_GA_KEY;

const App: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<User>();
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

  const getUser = () => {
    axios
      .get(buildEndpointUrl('me'))
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        history.push('/login');
      });
  };

  // on app load
  useEffect(() => {
    // get user profile
    getUser();
  }, []);

  const routes = user ? (
    <>
      <Switch>
        <Route path="/" exact>
          <HomeView user={user} role={role!} />
        </Route>

        <Route path="/request" exact>
          <RequestFormView user={user} role={role!} />
        </Route>

        <Route path="/request/:id" exact>
          <RequestFormView user={user} role={role!} />
        </Route>

        <Route path="/verification" exact>
          <MakerVerificationView user={user} />
        </Route>

        <Route path="/verification-pending" exact>
          <MakerVerificationPendingView />
        </Route>

        <Route path="/logout" exact>
          <LogoutView />
        </Route>

        {user.isSuperAdmin && (
          <>
            <Route path="/requests" exact>
              <RequestListView />
            </Route>

            <Route path="/makers" exact>
              <MakersView />
            </Route>
          </>
        )}

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
  );

  return (
    <Provider store={store}>
      <div id="headerAndMain">
        <Navbar user={user} role={role} setRole={setRole} />

        <ScrollToTop>
          <main className="main">
            <Container className="inner">
              {GA_KEY ? (
                <Analytics id={GA_KEY}>{routes}</Analytics>
              ) : (
                <>{routes}</>
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
