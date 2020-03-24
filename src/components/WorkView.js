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
            availableWork: [],
            maker: [],
            work: [],
        };

        this._getMaker = this._getMaker.bind(this)
        this._getWork = this._getWork.bind(this)
        this._getAvailableWork = this._getAvailableWork.bind(this)
        // this._handleJoinClassClick = this._handleJoinClassClick.bind(this)
        // this._handleNavigateDateClick = this._handleNavigateDateClick.bind(this)
        this._handleModalClose = this._handleModalClose.bind(this)
    }

    componentDidMount() {
        this._getMaker();
        this._getWork();
        this._getAvailableWork();
    }

    render() {
        if (this.state.maker == null) {
            return (null);
        }

        return (
            <div>
                <div className="container">
                    <div className="c-intro">
                        <h1>Your Work</h1>
                    </div>
                </div>
                <div className="c-list container">
                    {
                        (this.state.work == null || this.state.work.length === 0) &&
                        <div className="c-list__items -none">
                            No work found
                        </div>
                    }
                    {
                        this.state.work != null && this.state.work.length > 0 &&
                        <div className="c-list__items">
                            <div className="c-list__item -header">
                                <div>
                                    Date
                                </div>
                                <div>
                                    Count
                                </div>
                                <div>
                                    Details
                                </div>
                                <div>
                                    Status
                                </div>
                            </div>
                            {this.state.work.map((w, key) => {
                                return (
                                    <div key={key} className="c-list__item">
                                        <div>
                                            {moment(w.createDate).format("M/D/YYYY h:mm A")}
                                        </div>
                                        <div>
                                            {w.count} shields
                                        </div>
                                        <div>
                                            {w.details}
                                        </div>
                                        <div>
                                            Queued
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
                <div className="c-list container">
                    <div className="c-intro">
                        <h1>Open Requests</h1>
                    </div>
                    {
                        (this.state.availableWork == null || this.state.availableWork.length === 0) &&
                        <div className="c-list__items -none">
                            No work found
                        </div>
                    }
                    {
                        this.state.availableWork != null && this.state.availableWork.length > 0 &&
                        <div className="c-list__items">
                            <div className="c-list__item -header">
                                <div>
                                    Date
                                </div>
                                <div>
                                    Count
                                </div>
                                <div>
                                    Details
                                </div>
                            </div>
                            {this.state.availableWork.map((w, key) => {
                                return (
                                    <div key={key} className="c-list__item">
                                        <div>
                                            {moment(w.createDate).format("M/D/YYYY h:mm A")}
                                        </div>
                                        <div>
                                            {w.count} shields
                                        </div>
                                        <div>
                                            {w.details}
                                        </div>
                                        <div>
                                            Claim
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
        if (this.props.user == null || this.props.user.makerId == null) {
            return;
        }

        axios.get(buildEndpointUrl(`makers/${this.props.user.makerId}`))
            .then(res => {
                this.setState({
                    maker: res.data
                });
            })
    }

    _getWork() {
        axios.get(buildEndpointUrl(`makers/${this.props.user.makerId}/work`))
            .then(res => {
                this.setState({
                    work: res.data
                });
            })
    }

    _getAvailableWork() {
        axios.get(buildEndpointUrl(`requests/open`))
            .then(res => {
                this.setState({
                    availableWork: res.data
                });
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
