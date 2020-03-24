import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import MakerView from './components/MakerView';
import RequestView from './components/RequestView';
import NewRequestView from './components/NewRequestView';

import 'input-moment/dist/input-moment.css';
import './scss/app.scss';

function App() {
  return (
    <div>
      <Router>
        <main className="main">
          <Route path="/" exact component={NewRequestView} />
          <Route path="/app" component={HomeView} />
          <Route path="/app/makers" component={MakerView} />
          <Route path="/app/requests" component={RequestView} />
          <Route path="/app/login" component={LoginView} />
        </main>
      </Router>
    </div>
  );
}

export default App;
