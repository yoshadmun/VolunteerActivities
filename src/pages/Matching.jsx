import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchVolunteers, fetchEvents } from '../MockAPI';

function VolunteerMatchingForm() {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [matchedVolunteers, setMatchedVolunteers] = useState([]);
  const [selecting, setSelecting] = useState('volunteer'); // 'volunteer' or 'event'

  useEffect(()=>{
    fetchVolunteers().then(data=>setVolunteers(data));
    fetchEvents().then(data=>setEvents(data));
  }, []);

  useEffect(()=>{
    if (selectedVolunteer) {
      const matchedEvents = events.filter(event => 
      event.requirements.some(req=>selectedVolunteer.skills.includes(req))
    );
    setMatchedEvents(matchedEvents);
  }
}, [selectedVolunteer, events])

  useEffect(()=>{
    if(selectedEvent){
      const matchedVolunteers = volunteers.filter(volunteer=>
        volunteer.skills.some(skill=>selectedEvent.requirements.includes(skill))
      );
      setMatchedVolunteers(matchedVolunteers);
    }
  }, [selectedEvent, volunteers]);

  const volunteerOptions = volunteers.map(volunteer => ({
    value: volunteer.id,
    label: volunteer.name,
  }));

  const eventOptions = events.map(event => ({
    value: event.id,
    label: event.name,
  }));

  const matchedEventOptions = matchedEvents.map(event => ({
    value: event.id,
    label: event.name,
  }));

  const matchedVolunteerOptions = matchedVolunteers.map(volunteer => ({
    value: volunteer.id,
    label: volunteer.name,
  }));

  const handleVolunteerChange = selectedOption => {
    const volunteer = volunteers.find(v => v.id === selectedOption.value);
    setSelectedVolunteer(volunteer);
  };

  const handleEventChange = selectedOption => {
    const event = events.find(e => e.id === selectedOption.value);
    setSelectedEvent(event);
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
    <div className='container'>
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
      {selecting === 'volunteer' ? (
        <>
          <div className="form-group">
            <label htmlFor="volunteer">Volunteer Name</label>
            <Select
              id="volunteer"
              options={volunteerOptions}
              onChange={handleVolunteerChange}
              value={selectedVolunteer ? { value: selectedVolunteer.id, label: selectedVolunteer.name } : null}
              placeholder="Select volunteer..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="event">Matched Event</label>
            <Select
              id="event"
              options={matchedEventOptions}
              onChange={handleEventChange}
              isDisabled={!matchedEvents.length}
              placeholder="Select event..."
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="event">Event Name</label>
            <Select
              id="event"
              options={eventOptions}
              onChange={handleEventChange}
              value={selectedEvent ? { value: selectedEvent.id, label: selectedEvent.name } : null}
              placeholder="Select event..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="volunteer">Matched Volunteer</label>
            <Select
              id="volunteer"
              options={matchedVolunteerOptions}
              onChange={handleVolunteerChange}
              isDisabled={!matchedVolunteers.length}
              placeholder="Select volunteer..."
            />
          </div>
        </>
      )}
      <div className="form-actions" style={{ display: "flex", justifyContent: "space-evenly" }}>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <button type="submit">
          Submit
        </button>
      </div>
    </form>
    </div>
  );
}

export default VolunteerMatchingForm;
