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
        axios.get(buildEndpointUrl('requests'))
            .then(res => {
                this.setState({
                    requests: res.data
                });
            })
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="c-intro">
                        <h1>All Requests</h1>
                    </div>
                </div>
                <div className="c-requests container">
                    {
                        (this.state.requests == null || this.state.requests.length === 0) &&
                        <div className="c-list__items -none">
                            No reqests
                        </div>
                    }
                    {
                        this.state.requests != null && this.state.requests.length > 0 &&
                        <div className="c-list__items">
                            <div className="c-list__item -header">
                                <div>
                                    Name
                                </div>
                                <div>
                                    Email
                                </div>
                                <div>
                                    Date
                                </div>
                                <div>
                                    Status
                                </div>
                            </div>
                            {this.state.requests.map((r, key) => {
                                return (
                                    <div key={key} className="c-list__item">
                                        <div>
                                            {r.name}
                                        </div>
                                        <div>
                                            {r.email}
                                        </div>
                                        <div>
                                            {r.createdOn}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default RequestView;
