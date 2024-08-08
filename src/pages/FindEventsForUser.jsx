import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const MatchedEvents = () => {
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [assignedEvents, setAssignedEvents] = useState(new Set());
  const { user } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.sub) {
      const getAssignedEvents = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/assigned-events/${user.sub}`);
          setAssignedEvents(new Set(response.data));
        } catch (error) {
          console.log('Error fetching assigned events: ', error);
        }
      };

      const getMatchingEvents = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/eventsforuser/matching/${user.sub}`);
          setMatchedEvents(response.data);
        } catch (error) {
          console.log('Error fetching matching events: ', error);
        } finally {
          setLoading(false);
        }
      };

      getAssignedEvents();
      getMatchingEvents();
    }
  }, [user]);

  const handleAssign = async (event) => {
    try {
      await axios.post('http://localhost:3001/api/eventsforuser/assign', {
        volunteerId: user.sub,
        eventId: event._id,
      });
      setAssignedEvents((prevAssignedEvents) => new Set(prevAssignedEvents).add(event._id));
      console.log(`Successfully assigned to event: ${event.eventName}`);

      await axios.post(`http://localhost:3001/api/notifications/assignment`,{
        eventId: event._id,
      });
      setMessage('Event assigned and notification sent successfully');
    } catch (error) {
      console.log('Error assigning to event: ', error);
      setMessage('Failed to assign event or send notification.');
      alert('Error assigning to event');
    }
  };
  const formatLocation = (location) => {
    return `${location.streetAddress}, ${location.city}, ${location.state} ${location.zipCode}`;
  };
  const formatDate = (dateString) => {
    return dateString.split('T')[0]; // Extract only the date part
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Header />
      <h2 style={{ display: 'flex', justifyContent: 'center', fontSize: '3rem', fontFamily: 'monospace', padding: '2rem',color:'black' }}>Matched Events</h2>
      <table>
        <thead>
          <tr>
            <th style={{color:'black'}}>Event Name</th>
            <th style={{color:'black'}}>Location</th>
            <th style={{color:'black'}}>Date</th>
            <th style={{color:'black'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matchedEvents.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No matched events available.</td>
            </tr>
          ) : (
            matchedEvents.slice(0, 10).map((event, index) => (
              <tr key={index}>
                <td>{event.eventName}</td>
                <td>{formatLocation(event.location)}</td>
                <td>{formatDate(event.date)}</td>
                <td>
                  {assignedEvents.has(event._id) ? (
                    <button disabled style={{ backgroundColor: 'gray', cursor: 'not-allowed' }}>Assigned</button>
                  ) : (
                    <button onClick={() => handleAssign(event)}>Assign</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {message && <div style={{ marginTop: '1rem', fontSize: '1.5rem', color: 'black', fontWeight:'bold' }}>{message}</div>}
    </div>
  );
};

export default MatchedEvents;
