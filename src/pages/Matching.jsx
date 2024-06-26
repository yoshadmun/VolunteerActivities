import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchVolunteers, fetchEvents } from '../MockAPI';
import Header from '../components/Header';

function VolunteerMatchingForm() {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
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

  const pageSize = 10; // Items per page

  useEffect(() => {
    fetchVolunteers(volunteerSearch, volunteerPage, pageSize).then(response => {
      setVolunteers(response.data);
      setVolunteerTotal(response.total);
    });
  }, [volunteerSearch, volunteerPage]);

  useEffect(() => {
    fetchEvents(eventSearch, eventPage, pageSize).then(response => {
      setEvents(response.data);
      setEventTotal(response.total);
    });
  }, [eventSearch, eventPage]);

  useEffect(() => {
    if (selectedVolunteer) {
      const matchedEvents = events.filter(event =>
        event.requirements.some(req => selectedVolunteer.skills.includes(req))
      );
      setMatchedEvents(matchedEvents);
      if (selecting === "volunteer"){
        setSelectedEvent(null);
      }
    }
  }, [selectedVolunteer, events]);

  useEffect(() => {
    if (selectedEvent) {
      const matchedVolunteers = volunteers.filter(volunteer =>
        volunteer.skills.some(skill => selectedEvent.requirements.includes(skill))
      );
      setMatchedVolunteers(matchedVolunteers);
      if (selecting === "event") {
        setSelectedVolunteer(null); // Reset selected volunteer when event changes
      }
    }
  }, [selectedEvent, volunteers, selecting]);
  

  const volunteerOptions = volunteers.map(volunteer => ({
    value: volunteer.id,
    label: volunteer.name,
  }));

  const eventOptions = events.map(event => ({
    value: event.id,
    label: event.name,
  }));

  const matchedEventOptions = matchedEvents.slice((matchedEventPage - 1) * pageSize, matchedEventPage * pageSize).map(event => ({
    value: event.id,
    label: event.name,
  }));

  const matchedVolunteerOptions = matchedVolunteers.slice((matchedVolunteerPage - 1) * pageSize, matchedVolunteerPage * pageSize).map(volunteer => ({
    value: volunteer.id,
    label: volunteer.name,
  }));

  const handleVolunteerChange = selectedOption => {
    const volunteer = volunteers.find(v => v.id === selectedOption.value);
    setSelectedVolunteer(volunteer);
    setMatchedEventPage(1); // Reset matched event page
  };

  const handleEventChange = selectedOption => {
    const event = events.find(e => e.id === selectedOption.value);
    setSelectedEvent(event);
    setMatchedVolunteerPage(1); // Reset matched volunteer page
  };

  const handleReset = () => {
    setSelectedVolunteer(null); // Reset selected volunteer state
    setSelectedEvent(null); // Reset selected event state
    setMatchedEvents([]); // Clear matched events
    setMatchedVolunteers([]); // Clear matched volunteers
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      volunteer: selectedVolunteer,
      event: selectedEvent
    };
    console.log('Form submitted:', data);
    // Handle form submission logic here (e.g., send data to an API)
  };

  return (
    <div className="container">
      <Header/>
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
              <label htmlFor="volunteer" style={{marginTop:"15px"}}>Volunteer Name</label>
              <Select
                id="volunteer"
                options={volunteerOptions}
                onChange={handleVolunteerChange}
                value={selectedVolunteer ? { value: selectedVolunteer.id, label: selectedVolunteer.name } : null}
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
                value={selectedEvent ? { value: selectedEvent.id, label: selectedEvent.name } : null}
                isDisabled={!matchedEvents.length}
                placeholder="Select event..."
                required
              />
              <div className="pagination" style={{marginTop:"20px"}}>
                <button disabled={matchedEventPage === 1} onClick={() => setMatchedEventPage(matchedEventPage - 1)}>Previous</button>
                <span>Page {matchedEventPage} of {Math.ceil(matchedEvents.length / pageSize)}</span>
                <button disabled={matchedEventPage === Math.ceil(matchedEvents.length / pageSize)} onClick={() => setMatchedEventPage(matchedEventPage + 1)}>Next</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="event" style={{marginTop:'15px'}}>Event Name</label>
              <Select
                id="event"
                options={eventOptions}
                onChange={handleEventChange}
                value={selectedEvent ? { value: selectedEvent.id, label: selectedEvent.name } : null}
                placeholder="Select event..."
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
                value={selectedVolunteer ? { value: selectedVolunteer.id, label: selectedVolunteer.name } : null}
                isDisabled={!matchedVolunteers.length}
                placeholder="Select volunteer..."
              />
              <div className="pagination" style={{marginTop:'20px'}}>
                <button disabled={matchedVolunteerPage === 1} onClick={() => setMatchedVolunteerPage(matchedVolunteerPage - 1)}>Previous</button>
                <span>Page {matchedVolunteerPage} of {Math.ceil(matchedVolunteers.length / pageSize)}</span>
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
    </div>
  );
}

export default VolunteerMatchingForm;