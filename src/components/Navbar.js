import React, { Component } from 'react';
import { Link } from "react-router-dom";

import navlogo from '../img/navlogo.png'

class Navbar extends Component {

    render() {

        return (
            <nav className="c-navbar">
                <div className="c-navbar__wrapper">
                    <div className="c-navbar__logo">
                        <img src={navlogo} alt="Catamaran Logo" />
                    </div>
                    <div className="c-navbar__items">
                        <ul>
                            <li>
                                <Link to='/' className={this.props.activePage === 'home' ? '-active' : ''}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to='/makers' className={this.props.activePage === 'makers' ? '-active' : ''}>
                                    Makers
                                </Link>
                            </li>
                            <li>
                                <Link to='/requests' className={this.props.activePage === 'requests' ? '-active' : ''}>
                                    Requests
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
