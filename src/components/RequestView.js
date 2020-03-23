import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { buildEndpointUrl } from '../Utilities';

class RequestView extends Component {
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
                        <h1>Development in Progress</h1>
                        <p>This section will be customized per student to display attendance by day and class.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default RequestView;
