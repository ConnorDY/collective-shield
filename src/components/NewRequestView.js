import React, { Component } from 'react';
import axios from 'axios';
import Dropdown from 'react-dropdown';

import { buildEndpointUrl, readCookie } from '../utilities';

import 'react-dropdown/style.css';

class NewRequestView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nameError: null,
      email: '',
      emailError: null,
      role: '',
      roleError: null,
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      addressError: null,
      details: '',
      isCreated: false
    };

    this._createNewRequest = this._createNewRequest.bind(this);
    this._getCleanState = this._getCleanState.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleSelect = this._handleSelect.bind(this);
    this._validateRequest = this._validateRequest.bind(this);
  }

  componentDidMount() {
    axios.defaults.headers.post['CSRF-Token'] = readCookie('XSRF-TOKEN');
  }

  render() {
    const options = [
      'Doctor',
      'Nurse',
      'First Responder',
      'Medical Support Staff'
    ];

    const states = [
      'AL',
      'AK',
      'AZ',
      'AR',
      'CA',
      'CO',
      'CT',
      'DE',
      'FL',
      'GA',
      'HI',
      'ID',
      'IL',
      'IN',
      'IA',
      'KS',
      'KY',
      'LA',
      'ME',
      'MD',
      'MA',
      'MI',
      'MN',
      'MS',
      'MO',
      'MT',
      'NE',
      'NV',
      'NH',
      'NJ',
      'NM',
      'NY',
      'NC',
      'ND',
      'OH',
      'OK',
      'OR',
      'PA',
      'RI',
      'SC',
      'SD',
      'TN',
      'TX',
      'UT',
      'VT',
      'VA',
      'WA',
      'WV',
      'WI',
      'WY',
      'DC',
      'MH'
    ];

    return (
      <div>
        <div className="container">
          <div className="c-intro">
            <h1>Request N95 Shields</h1>
          </div>
        </div>
        <div className="container">
          {this.state.isCreated && (
            <div className="c-requestForm -pad">
              <p>
                Thank you! You will receive an email confirming your request
              </p>
            </div>
          )}
          {!this.state.isCreated && (
            <div className="c-requestForm">
              <form onSubmit={this._createNewRequest}>
                <fieldset>
                  <input
                    type="text"
                    onChange={(e) => this._handleChange('name', e)}
                    placeholder="Your Name *"
                    required={true}
                    value={this.state.name}
                  />
                  {this.state.nameError != null && (
                    <span className="-error">{this.state.nameError}</span>
                  )}
                </fieldset>
                <fieldset>
                  <input
                    type="email"
                    onChange={(e) => this._handleChange('email', e)}
                    placeholder="Email Address *"
                    required={true}
                    value={this.state.email}
                  />
                  {this.state.emailError != null && (
                    <span className="-error">{this.state.emailError}</span>
                  )}
                </fieldset>
                <fieldset>
                  <Dropdown
                    options={options}
                    onChange={(e) => this._handleSelect('role', e)}
                    placeholder="Select Your Role *"
                    required={true}
                    value={this.state.role}
                  />
                  {this.state.roleError != null && (
                    <span className="-error">{this.state.roleError}</span>
                  )}
                </fieldset>
                <fieldset>
                  <input
                    type="text"
                    onChange={(e) => this._handleChange('line1', e)}
                    placeholder="Address *"
                    required={true}
                    value={this.state.line1}
                  />
                  <input
                    type="text"
                    onChange={(e) => this._handleChange('line2', e)}
                    placeholder="Address (Line 2)"
                    value={this.state.line2}
                  />
                  <input
                    className="-short"
                    type="text"
                    onChange={(e) => this._handleChange('city', e)}
                    placeholder="City *"
                    required={true}
                    value={this.state.city}
                  />
                  <Dropdown
                    className="-short"
                    options={states}
                    onChange={(e) => this._handleSelect('state', e)}
                    placeholder="State *"
                    required={true}
                    value={this.state.state}
                  />
                  <input
                    className="-short"
                    type="text"
                    onChange={(e) => this._handleChange('zip', e)}
                    placeholder="Zipcode / Postal Code *"
                    required={true}
                    value={this.state.zip}
                  />
                  {this.state.addressError != null && (
                    <span className="-error">{this.state.addressError}</span>
                  )}
                </fieldset>
                <fieldset>
                  <textarea
                    onChange={(e) => this._handleChange('details', e)}
                    placeholder="Comments"
                    value={this.state.details}
                  ></textarea>
                </fieldset>
                <input type="submit" className="c-button" value="Submit" />
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  _createNewRequest(e) {
    e.preventDefault();

    if (!this._validateRequest()) {
      return;
    }

    const data = {
      name: this.state.name,
      email: this.state.email,
      position: this.state.role,
      line1: this.state.line1,
      line2: this.state.line2,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      details: this.state.details
    };

    axios
      .post(buildEndpointUrl('request', '/public'), data)
      .then((res) => {
        this.setState({
          isCreated: true
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  _getCleanState() {
    return {
      nameError: null,
      emailError: null,
      roleError: null,
      addressError: null
    };
  }

  _handleChange(name, e) {
    const stateChange = this._getCleanState();
    stateChange[name] = e.target.value;
    this.setState(stateChange);
  }

  _handleSelect(name, e) {
    const stateChange = this._getCleanState();
    stateChange[name] = e.value;
    this.setState(stateChange);
  }

  _validateRequest() {
    let isValid = true;
    if (this.state.name == null || this.state.name.length === 0) {
      isValid = false;
      this.setState({
        nameError: 'Name is required'
      });
    }
    if (this.state.email == null || this.state.email.length === 0) {
      isValid = false;
      this.setState({
        emailError: 'Email Address is required'
      });
    }
    if (this.state.role == null || this.state.role.length === 0) {
      isValid = false;
      this.setState({
        roleError: 'Your role is required'
      });
    }
    if (
      this.state.line1 == null ||
      this.state.line1.length === 0 ||
      this.state.city == null ||
      this.state.city.length === 0 ||
      this.state.state == null ||
      this.state.state.length === 0 ||
      this.state.zip == null ||
      this.state.zip.length === 0
    ) {
      isValid = false;
      this.setState({
        addressError: 'Valid address is required'
      });
    }
    return isValid;
  }
}

export default NewRequestView;
