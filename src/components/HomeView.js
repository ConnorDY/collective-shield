import React, { Component } from 'react';
import axios from 'axios';
import QuickstartItem from './QuickstartItem';
import Navbar from './Navbar';
import { buildEndpointUrl } from '../Utilities';

class HomeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    componentDidMount() {
        axios.get(buildEndpointUrl('me'))
            .then(res => {
                this.setState({
                    user: res.data
                });
            })
    }

    render() {

        return (
            <div>
                <Navbar activePage="home" />
                <div className="container">
                    <div className="c-intro">
                        <h1>Welcome, Phil</h1>
                        <p>Content here</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeView;
