import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Header from '../components/Header';
import axios from 'axios';

function VolunteerMatchingForm() {
  const [volunteers, setVolunteers] = useState([]);
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [matchedVolunteers, setMatchedVolunteers] = useState([]);
  const [selecting, setSelecting] = useState('volunteer'); // 'volunteer' or 'event'
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [volunteerPage, setVolunteerPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [volunteerTotal, setVolunteerTotal] = useState(0);
  const [eventTotal, setEventTotal] = useState(0);
  const [matchedEventPage, setMatchedEventPage] = useState(1);
  const [matchedVolunteerPage, setMatchedVolunteerPage] = useState(1);
  const [message, setMessage] = useState('');

  const pageSize = 10; // Items per page

  useEffect(() => {
    axios.get(`http://localhost:3001/api/volunteers?search=${volunteerSearch}&page=${volunteerPage}&pageSize=${pageSize}`)
      .then(response => {
        setVolunteers(response.data.volunteers);
        setVolunteerTotal(response.data.total);
      })
      .catch(error => {
        console.error('Error fetching volunteers:', error);
        setMessage('Error fetching volunteers');
      });

    axios.get('http://localhost:3001/api/volunteers?search=&page=1&pageSize=1000')
      .then(response => {
        setAllVolunteers(response.data.volunteers);
      })
      .catch(error => {
        console.error('Error fetching all volunteers:', error);
      });
  }, [volunteerSearch, volunteerPage]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/events?search=${eventSearch}&page=${eventPage}&pageSize=${pageSize}`)
      .then(response => {
        setEvents(response.data.events);
        setEventTotal(response.data.total);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setMessage('Error fetching events');
      });

    axios.get('http://localhost:3001/api/events?search=&page=1&pageSize=1000')
      .then(response => {
        setAllEvents(response.data.events);
      })
      .catch(error => {
        console.error('Error fetching all events:', error);
      });
  }, [eventSearch, eventPage]);

  useEffect(() => {
    if (selectedVolunteer) {
      const matchedEvents = allEvents.filter(event =>
        event.requiredSkills.some(req => selectedVolunteer.skills.includes(req))
      );
      setMatchedEvents(matchedEvents);
      if (selecting === "volunteer") {
        setSelectedEvent(null);
      }
    }
  }, [selectedVolunteer, allEvents, selecting]);

  useEffect(() => {
    if (selectedEvent) {
      const matchedVolunteers = allVolunteers.filter(volunteer =>
        volunteer.skills.some(skill => selectedEvent.requiredSkills.includes(skill))
      );
      setMatchedVolunteers(matchedVolunteers);
      if (selecting === "event") {
        setSelectedVolunteer(null); // Reset selected volunteer when event changes
      }
    }
  }, [selectedEvent, allVolunteers, selecting]);

  const volunteerOptions = volunteers.map(volunteer => ({
    value: volunteer.userId,
    label: volunteer.fullName,
  }));

  const eventOptions = events.map(event => ({
    value: event._id,
    label: event.eventName,
  }));

  const matchedEventOptions = matchedEvents.slice((matchedEventPage - 1) * pageSize, matchedEventPage * pageSize).map(event => ({
    value: event._id,
    label: event.eventName,
  }));

  const matchedVolunteerOptions = matchedVolunteers.slice((matchedVolunteerPage - 1) * pageSize, matchedVolunteerPage * pageSize).map(volunteer => ({
    value: volunteer.userId,
    label: volunteer.fullName,
  }));

  const handleVolunteerChange = selectedOption => {
    const volunteer = allVolunteers.find(v => v.userId === selectedOption.value);
    setSelectedVolunteer(volunteer);
    setMatchedEventPage(1); // Reset matched event page
  };

  const handleEventChange = selectedOption => {
    const event = allEvents.find(e => e._id === selectedOption.value);
    setSelectedEvent(event);
    setMatchedVolunteerPage(1); // Reset matched volunteer page
  };

  const handleReset = () => {
    setSelectedVolunteer(null); // Reset selected volunteer state
    setSelectedEvent(null); // Reset selected event state
    setMatchedEvents([]); // Clear matched events
    setMatchedVolunteers([]); // Clear matched volunteers
    setMessage(''); // Clear message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVolunteer || !selectedEvent) {
      setMessage('Please select both a volunteer and an event.');
      return;
    }
    const data = {
      volunteerId: selectedVolunteer.userId,
      eventId: selectedEvent._id
    };
    console.log('Form submitted:', data);

    try {
      const response = await axios.post('http://localhost:3001/api/assignment', data);
      console.log('Event assigned to volunteer successfully');
      setMessage('Event assigned to volunteer and notification sent successfully');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage('Volunteer is already assigned to this event');
      } else {
        setMessage('Error assigning event to volunteer');
        console.log('Error assigning event to volunteer: ', error);
      }
    }
  };

  return (
    <div className="container">
      <Header />
      <form className="matchingForm" onSubmit={handleSubmit}>
        <h1>Volunteer Matching Form</h1>
        <div className="toggle-buttons">
          <button type="button" onClick={() => setSelecting('volunteer')}>
            Select Volunteer First
          </button>
          <button type="button" onClick={() => setSelecting('event')}>
            Select Event First
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Volunteers..."
            value={volunteerSearch}
            onChange={e => setVolunteerSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search Events..."
            value={eventSearch}
            onChange={e => setEventSearch(e.target.value)}
          />
        </div>
        {selecting === 'volunteer' ? (
          <>
            <div className="form-group">
              <label htmlFor="volunteer" style={{ marginTop: "15px" }}>Volunteer Name</label>
              <Select
                id="volunteer"
                options={volunteerOptions}
                onChange={handleVolunteerChange}
                value={selectedVolunteer ? { value: selectedVolunteer.userId, label: selectedVolunteer.fullName } : null}
                placeholder="Select volunteer..."
                required
              />
            </div>
            <div className="pagination">
              <button disabled={volunteerPage === 1} onClick={() => setVolunteerPage(volunteerPage - 1)}>Previous</button>
              <span>Page {volunteerPage} of {Math.ceil(volunteerTotal / pageSize)}</span>
              <button disabled={volunteerPage === Math.ceil(volunteerTotal / pageSize)} onClick={() => setVolunteerPage(volunteerPage + 1)}>Next</button>
            </div>
            <div className="form-group">
              <label htmlFor="event">Matched Event</label>
              <Select
                id="event"
                options={matchedEventOptions}
                onChange={handleEventChange}
                value={selectedEvent ? { value: selectedEvent._id, label: selectedEvent.eventName } : null}
                isDisabled={!matchedEvents.length}
                placeholder="Select event..."
                required
              />
              <div className="pagination" style={{ marginTop: "20px" }}>
                <button disabled={matchedEventPage === 1} onClick={() => setMatchedEventPage(matchedEventPage - 1)}>Previous</button>
                <span>{matchedEvents.length === 0
                  ? "Page 0 of 0"
                  : `Page ${matchedEventPage} of ${Math.ceil(matchedEvents.length / pageSize)}`}
                </span>
                <button disabled={matchedEventPage === Math.ceil(matchedEvents.length / pageSize)} onClick={() => setMatchedEventPage(matchedEventPage + 1)}>Next</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="event" style={{ marginTop: '15px' }}>Event Name</label>
              <Select
                id="event"
                options={eventOptions}
                onChange={handleEventChange}
                value={selectedEvent ? { value: selectedEvent._id, label: selectedEvent.eventName } : null}
                placeholder="Select event..."
                required
              />
            </div>
            <div className="pagination">
              <button disabled={eventPage === 1} onClick={() => setEventPage(eventPage - 1)}>Previous</button>
              <span>Page {eventPage} of {Math.ceil(eventTotal / pageSize)}</span>
              <button disabled={eventPage === Math.ceil(eventTotal / pageSize)} onClick={() => setEventPage(eventPage + 1)}>Next</button>
            </div>
            <div className="form-group">
              <label htmlFor="volunteer">Matched Volunteer</label>
              <Select
                id="volunteer"
                options={matchedVolunteerOptions}
                onChange={handleVolunteerChange}
                value={selectedVolunteer ? { value: selectedVolunteer.userId, label: selectedVolunteer.fullName } : null}
                isDisabled={!matchedVolunteers.length}
                placeholder="Select volunteer..."
              />
              <div className="pagination" style={{ marginTop: '20px' }}>
                <button disabled={matchedVolunteerPage === 1} onClick={() => setMatchedVolunteerPage(matchedVolunteerPage - 1)}>Previous</button>
                <span>{matchedVolunteers.length === 0
                  ? "Page 0 of 0"
                  : `Page ${matchedVolunteerPage} of ${Math.ceil(matchedVolunteers.length / pageSize)}`}
                </span>
                <button disabled={matchedVolunteerPage === Math.ceil(matchedVolunteers.length / pageSize)} onClick={() => setMatchedVolunteerPage(matchedVolunteerPage + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
        <div className="form-actions" style={{ display: "flex", justifyContent: "space-evenly" }}>
          <button className="button" type="button" onClick={handleReset}>
            Reset
          </button>
          <button className="button" type="submit">
            Submit
          </button>
        </div>
      </form>
      {message && <div style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'green' }}>{message}</div>}
    </div>
  );
}

export default VolunteerMatchingForm;
