import React from 'react';
import { Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import MakerView from './components/MakerView';
import RequestView from './components/RequestView';
import NewRequestView from './components/NewRequestView';

import './scss/app.scss';

const App: React.FC = () => {
  return (
    <main className="main">
      <Container>
        {/* <Route path="/" exact component={NewRequestView} /> */}
        <Route path="/" component={HomeView} />
        <Route path="/makers" component={MakerView} />
        <Route path="/requests" component={RequestView} />
        <Route path="/login" component={LoginView} />
      </Container>
    </main>
  );
};

export default App;
