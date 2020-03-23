import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { buildEndpointUrl } from '../Utilities';

class LoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            district: null
        };
    }

    componentDidMount() {
        axios.get(buildEndpointUrl('district'))
            .then(res => {
                this.setState({
                    district: res.data
                });
            })
    }

    render() {
        if (this.state.district == null) {
            return (<Navbar activePage="attendance" />);
        }

        return (
            <div>
                <Navbar activePage="attendance" />
                <div className="container">
                    <div className="c-intro">
                        <a href="/login/facebook">Login with Facebook</a>
                        <a href="/login/google">Login with Google</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginView;
