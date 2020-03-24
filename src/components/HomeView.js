import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import WorkView from './WorkView'
import MyRequestsView from './MyRequestsView'
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
            .catch(err => {
                if (err.response != null && err.response.status === 401) {
                    return this.props.history.push('/login')
                }
                console.error(err)
            })
    }

    render() {
        if (this.state.user == null) {
            return (null)
        }

        if (this.state.user.maker != null) {
            return (<WorkView user={this.state.user} />)
        }

        if (!this.state.user.isSuperAdmin) {
            return (<MyRequestsView user={this.state.user} />)
        }

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
