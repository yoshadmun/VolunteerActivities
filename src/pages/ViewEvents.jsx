import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState('');
  const [eventPage, setEventPage] = useState(1);
  const [eventTotal, setEventTotal] = useState(0);
  const navigate = useNavigate();

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
      console.log('Removing event with ID:', eventId); // Log the event ID being removed

      //set event to inactive
      await axios.put(`http://localhost:3001/api/events/remove/${eventId}/active`, { active: false });
      //send update notification to assignedVolunteers for that event
      await axios.post(`http://localhost:3001/api/notifications/update/${eventId}`);
      setEvents(events.filter(e => e._id !== eventId)); // Remove from the current list in state
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  const formatLocation = (location) => {
    return `${location.streetAddress}, ${location.city}, ${location.state}, ${location.zipCode}`;
  };
  const formatDate = (dateString) => {
    return dateString.split('T')[0]; // Extract only the date part
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/report/events/csv', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'events_report.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating CSV report:', error);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/report/events/pdf', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'events_report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating PDF report:', error);
    }
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
                <tr key={event._id}>
                  <td onClick={() => handleEventClick(event._id)} style={{ cursor: 'pointer' }}>
                    {event.eventName}
                  </td>
                  <td>{formatLocation(event.location)}</td>
                  <td>{formatDate(event.date)}</td>
                  <td>{event.requiredSkills.join(', ')}</td>
                  <td>
                    <button onClick={() => handleRemoveEvent(event._id)}>Remove</button>
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
        <div style={{ marginBottom:'20px', display: 'flex', justifyContent: 'space-between', width:'50%' }}>
          <button  onClick={downloadCSV}style={{ padding: '10px 20px', fontSize: '1.5rem', backgroundColor: 'darkslateblue', color: 'white', border: 'none', cursor: 'pointer' }}>
            Download CSV
          </button>
          <button  onClick={downloadPDF}style={{ padding: '10px 20px', fontSize: '1.5rem', backgroundColor: 'darkslateblue', color: 'white', border: 'none', cursor: 'pointer' }}>
            Download PDF 
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewEvents;
