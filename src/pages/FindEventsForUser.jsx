import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const MatchedEvents = () => {
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [assignedEvents, setAssignedEvents] = useState(new Set());
  const { user } = useAuth0();
  const [loading, setLoading] = useState(true);

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
        eventId: event.id,
      });
      setAssignedEvents((prevAssignedEvents) => new Set(prevAssignedEvents).add(event.id));
      console.log(`Successfully assigned to event: ${event.eventName}`);
    } catch (error) {
      console.log('Error assigning to event: ', error);
      alert('Error assigning to event');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: '2rem', fontFamily: 'monospace', padding: '2rem' }}>Matched Events</div>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Actions</th>
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
                <td>{event.location}</td>
                <td>{event.date}</td>
                <td>
                  {assignedEvents.has(event.id) ? (
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
    </div>
  );
};

export default MatchedEvents;