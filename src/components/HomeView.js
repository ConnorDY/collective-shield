import React, { Component } from 'react';
import axios from 'axios';
import QuickstartItem from './QuickstartItem';
import Navbar from './Navbar';
import { buildEndpointUrl } from '../Utilities';

class HomeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            district: null
        };
    }

    componentDidMount() {
        // axios.get(buildEndpointUrl('district'))
        //     .then(res => {
        //         this.setState({
        //             district: res.data
        //         });
        //     })
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
                {/* <div className="c-quickstart container">
                    <h2>Getting Started</h2>
                    {this.state.district.started.map((s) => {
                        return (
                            <QuickstartItem
                                content={s.content}
                                title={s.title} />
                        )
                    })}
                </div> */}
            </div>
        );
    }
}

export default HomeView;
