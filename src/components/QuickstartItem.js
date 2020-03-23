import React, { Component } from 'react';

class QuickstartItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this._triggerItem = this._triggerItem.bind(this)
    }

    render() {
        return (
            <div className={`c-quickstart__item ${this.state.isOpen ? "-open" : ""}`} onClick={this._triggerItem}>
                <h3>{this.props.title}</h3>
                <i className="c-arrow -large -down" />
                <div className="c-quickstart__item__content" dangerouslySetInnerHTML={{ __html: this.props.content }}></div>
            </div>
        );
    }

    _triggerItem(e) {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
}

export default QuickstartItem;
