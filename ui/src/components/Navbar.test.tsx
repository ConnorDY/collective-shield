import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './Navbar';

describe('Navbar', () => {
  const props = {
    role: 'requester',
    setRole: () => {},
    user: undefined
  };

  const user: any = {
    firstName: 'Mary'
  };

  it('is defined', () => {
    const wrapper = shallow(
      <Router>
        <Navbar {...props} />
      </Router>
    );
    expect(wrapper).toBeDefined();
  });

  it('is defined when there is a user object', () => {
    const wrapper = shallow(
      <Router>
        <Navbar {...props} user={user} />
      </Router>
    );
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(
      <Router>
        <Navbar {...props} user={user} />
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('matches snapshot when there is a user object', () => {
    const wrapper = shallow(
      <Router>
        <Navbar {...props} user={user} />
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
