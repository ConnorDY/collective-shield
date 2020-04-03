import React from 'react';
import { shallow } from 'enzyme';
import Navbar from './Navbar';

describe('Navbar', () => {
  const props = {
    user: {
      firstName: 'Mary'
    }
  };

  it('is defined', () => {
    const wrapper = shallow(<Navbar />);
    expect(wrapper).toBeDefined();
  });

  it('is defined when there is a user object', () => {
    const wrapper = shallow(<Navbar {...props} />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<Navbar />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches snapshot when there is a user object', () => {
    const wrapper = shallow(<Navbar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
