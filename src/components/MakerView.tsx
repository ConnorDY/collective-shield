import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

import { buildEndpointUrl } from '../utilities';
import Maker from '../models/Maker';

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

export default function MakerView() {
  const history = useHistory();

  const [makers, setMakers] = useState<Maker[]>([]);
  const [eventStudent, setEventStudent] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  function getMaker() {
    if (selectedEvent == null || selectedEvent.meetingId == null) {
      return;
    }

    axios
      .get(buildEndpointUrl(`makers/${selectedEvent.meetingId}`))
      .then((res) => {
        setEventStudent(res.data);
      });
  }

  function getMakers() {
    axios
      .get(buildEndpointUrl(`makers`))
      .then((res) => {
        setMakers(res.data);
      })
      .catch((err) => {
        if (err.response != null && err.response.status === 401) {
          return history.push('/login');
        }
        console.error(err);
      });
  }

  // function handleJoinClassClick(event, e) {
  //     e.preventDefault();

  //     setSelectedEvent(event);
  // }

  function handleModalClose() {
    setSelectedEvent(null);
  }

  useEffect(() => {
    getMakers();
  }, []);

  console.log(makers)

  if (makers === null || makers.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="container">
        <div className="c-intro">
          <h1>Maker List</h1>
        </div>
      </div>
      <div className="c-makers container">
        {makers === null || makers.length === 0 ? (
          <div className="c-makers__items -none">No makers found</div>
        ) : (
          <div className="c-makers__items">
            <div className="c-makers__item -header">
              <div>Name</div>
              <div>Email</div>
              <div>Total Prints</div>
            </div>
            {makers.map((maker, key) => {
              return (
                <div key={key} className="c-makers__item">
                  <div>{maker.name}</div>
                  <div>{maker.email}</div>
                  <div>{maker.prints}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        contentLabel="Add a maker"
        isOpen={selectedEvent !== null}
        onRequestClose={handleModalClose}
        style={customStyles}
      >
        <div className="c-modal">
          {selectedEvent !== null && (
            <div>
              <h2>{selectedEvent.course.name}</h2>
              <p>{selectedEvent.course.description}</p>
              {eventStudent !== null && eventStudent.joinUrl !== null && (
                <a
                  className="c-button"
                  href={eventStudent.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Now
                </a>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
