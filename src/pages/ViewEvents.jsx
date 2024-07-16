import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';

function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState('');
  const [eventPage, setEventPage] = useState(1);
  const [eventTotal, setEventTotal] = useState(0);

  const pageSize = 20;

  useEffect(() => {
    axios.get(`http://localhost:3001/api/events?search=${eventSearch}&page=${eventPage}&pageSize=${pageSize}`)
      .then(response => {
        setEvents(response.data.events);
        setEventTotal(response.data.total);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, [eventSearch, eventPage]);

  const handleRemoveEvent = async (eventId) => {
    try {
      await axios.put(`http://localhost:3001/api/events/remove/${eventId}/active`, { active: false });
      setEvents(events.filter(e => e.id !== eventId)); // Remove from the current list in state
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  const formatLocation = (location) => {
    return `${location.streetAddress}, ${location.city}, ${location.state}, ${location.zipCode}`;
  };

  return (
    <div className="container">
      <Header />
      <div className="profiles-container">
        <h2>View Events</h2>
        <div className="search-container" style={{ padding: '1rem', display: 'flex' }}>
          <input
            className="search-input"
            type="text"
            placeholder="Search Events..."
            value={eventSearch}
            onChange={e => setEventSearch(e.target.value)}
          />
        </div>
        <div>
          <h2>All Events</h2>
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Required Skills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.eventName}</td>
                  <td>{formatLocation(event.location)}</td>
                  <td>{event.date}</td>
                  <td>{event.requiredSkills.join(', ')}</td>
                  <td>
                    <button onClick={() => handleRemoveEvent(event.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination" style={{ padding: '1rem' }}>
          <button disabled={eventPage === 1} onClick={() => setEventPage(eventPage - 1)}>Previous</button>
          <span>{events.length === 0
            ? "Page 0 of 0"
            : `Page ${eventPage} of ${Math.ceil(eventTotal / pageSize)}`}
          </span>
          <button disabled={eventPage === Math.ceil(eventTotal / pageSize)} onClick={() => setEventPage(eventPage + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ViewEvents;
