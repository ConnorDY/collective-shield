import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-modal';
import Navbar from './Navbar';
import { buildEndpointUrl } from '../Utilities';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class WorkView extends Component {
    constructor(props) {
        super(props)

        this.refreshTimer = null

        this.state = {
            makers: [],
            newMaker: null,
        };

        this._getMaker = this._getMaker.bind(this)
        this._getMakers = this._getMakers.bind(this)
        // this._handleJoinClassClick = this._handleJoinClassClick.bind(this)
        // this._handleNavigateDateClick = this._handleNavigateDateClick.bind(this)
        this._handleModalClose = this._handleModalClose.bind(this)
    }

    componentDidMount() {
        this._getMakers();
    }

    render() {
        if (this.state.makers == null || this.state.makers.length === 0) {
            return (null);
        }

        return (
            <div>
                {
                    this.props.showNav &&
                    <Navbar activePage="makers" />
                }
                <div className="container">
                    <div className="c-intro">
                        <h1>Maker List</h1>
                    </div>
                </div>
                <div className="c-makers container">
                    {
                        (this.state.makers == null || this.state.makers.length === 0) &&
                        <div className="c-makers__items -none">
                            No makers found
                        </div>
                    }
                    {
                        this.state.makers != null && this.state.makers.length > 0 &&
                        <div className="c-makers__items">
                            <div className="c-makers__item -header">
                                <div>
                                    Name
                                </div>
                                <div>
                                    Email
                                </div>
                                <div>
                                    Total Prints
                                </div>
                            </div>
                            {this.state.makers.map((maker, key) => {
                                return (
                                    <div key={key} className="c-makers__item">
                                        <div>
                                            {maker.name}
                                        </div>
                                        <div>
                                            {maker.email}
                                        </div>
                                        <div>
                                            {maker.prints}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
                <Modal
                    contentLabel="Add a maker"
                    isOpen={this.state.selectedEvent != null}
                    onRequestClose={this._handleModalClose}
                    style={customStyles}>
                    <div className="c-modal">
                        {
                            this.state.selectedEvent != null &&
                            <div>
                                <h2>{this.state.selectedEvent.course.name}</h2>
                                <p>{this.state.selectedEvent.course.description}</p>
                                {
                                    this.state.eventStudent != null && this.state.eventStudent.joinUrl != null &&
                                    <a
                                        className="c-button"
                                        href={this.state.eventStudent.joinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Join Now
                                    </a>
                                }
                            </div>
                        }

                    </div>
                </Modal>
            </div>
        );
    }

    _getMaker() {
        if (this.state.selectedEvent == null || this.state.selectedEvent.meetingId == null) {
            return;
        }

        axios.get(buildEndpointUrl(`makers/${this.state.selectedEvent.meetingId}`))
            .then(res => {
                this.setState({
                    eventStudent: res.data
                });
            })
    }

    _getMakers() {
        axios.get(buildEndpointUrl(`makers`))
            .then(res => {
                this.setState({
                    makers: res.data
                });
            })
            .catch(err => {
                if (err.response != null && err.response.status === 401) {
                    return this.props.history.push('/app/login')
                }
                console.error(err)
            })
    }

    // _handleJoinClassClick(event, e) {
    //     e.preventDefault()

    //     this.setState({
    //         selectedEvent: event
    //     })
    // }

    _handleModalClose() {
        this.setState({
            selectedEvent: null
        })
    }
}

export default WorkView;
