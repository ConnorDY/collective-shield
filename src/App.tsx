import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { get } from 'lodash';

import User from './models/User';
import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import MakerView from './components/MakerView';
import RequestView from './components/RequestView';
// import NewRequestView from './components/NewRequestView';
import WorkView from './components/WorkView';

import './scss/app.scss';
import Navbar from './components/Navbar';
import { getUser } from './actions/user';
import { RootState } from './reducers';

const App: React.FC = (props) => {

  const dispatch = useDispatch()
  const userProfile = useSelector((state: RootState) => state.user)

  const { user, isLoading, hasErrored } = userProfile;

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <>
      <Navbar user={user} />
      <main className="main">
        <Container>
          { isLoading && <div>Loading...</div> }
          { hasErrored && <div>An error has occurred.</div> }
          {user && !isLoading && !hasErrored ? (
            <>
              {/* <Route path="/" exact component={NewRequestView} /> */}
              <Route path="/">
                <HomeView user={user} />
              </Route>

              <Route path="/makers">
                <MakerView />
              </Route>

              <Route path="/requests">
                <RequestView />
              </Route>

              <Route path="/work">
                <WorkView user={user} />
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
    </>
  );
};

export default App;
