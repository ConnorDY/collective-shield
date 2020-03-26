import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';
import moment from 'moment';

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

export default function WorkView({ user }: { user: any }) {
  //this.refreshTimer = null;

  const [availableWork, setAvailableWork] = useState<any[]>([]);
  const [maker, setMaker] = useState<any[]>([]);
  const [work, setWork] = useState<any[]>([]);

  function getMaker() {
    if (!user || !user.makerId) {
      return;
    }

    axios.get(buildEndpointUrl(`makers/${user.makerId}`)).then((res) => {
      setMaker(res.data);
    });
  }

  function getWork() {
    axios.get(buildEndpointUrl(`makers/${user.makerId}/work`)).then((res) => {
      setWork(res.data);
    });
  }

  function getAvailableWork() {
    axios.get(buildEndpointUrl(`requests/open`)).then((res) => {
      setAvailableWork(res.data);
    });
  }

  // function handleJoinClassClick(event, e) {
  //     e.preventDefault()

  //     this.setState({
  //         selectedEvent: event
  //     })
  // }

  function handleModalClose() {
    // setSelectedEvent(null);
  }

  // on load
  useEffect(() => {
    getMaker();
    getWork();
    getAvailableWork();
  }, []);

  if (!maker) {
    return null;
  }

  return (
    <>
      <Row>
        <Col>
          <h1>My Work</h1>
        </Col>
      </Row>

      <Row>
        {(!work || work.length === 0) && (
          <Col className="no-work">No work found</Col>
        )}

        {work && work.length > 0 && (
          <Col>
            <table>
              <thead>
                <th>Count</th>
                <th>Requestor</th>
                <th colSpan={2}>Status</th>
              </thead>

              <tbody>
                {work.map((w, key) => {
                  return (
                    <tr key={key}>
                      <td>{w.count}</td>
                      <td>{w.name}</td>
                      <td>{w.status}</td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <h1>Open Requests</h1>
        </Col>
      </Row>

      <Row>
        {(!availableWork || availableWork.length === 0) && (
          <Col className="no-work">No work found</Col>
        )}

        {availableWork && availableWork.length > 0 && (
          <Col>
            <table>
              <thead>
                <th>Count</th>
                <th>Distance</th>
                <th>Requestor</th>
                <th></th>
              </thead>

              <tbody>
                {availableWork.map((w, key) => {
                  return (
                    <tr key={key}>
                      <td>{w.count}</td>
                      <td></td>
                      <td>{w.name}</td>
                      <td>Claim</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Col>
        )}
      </Row>

      <Modal
        contentLabel="Add a maker"
        //isOpen={selectedEvent != null}
        isOpen={false}
        onRequestClose={handleModalClose}
        //style={customStyles}
      >
        modal content
      </Modal>
    </>
  );
}
