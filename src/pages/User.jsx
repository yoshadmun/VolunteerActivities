import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const User = () => {
  const { user } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [assignedEventIds, setAssignedEventIds] = useState([]);
  const [completedEventIds, setCompletedEventIds] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);

  // For user profile
  useEffect(() => {
    if (user && user.sub) {
      const getProfile = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/user-profile/${user.sub}`);
          setProfile(response.data);
        } catch (error) {
          console.log('Error getting profile data: ', error);
        }
      };
      getProfile();
    }
  }, [user]);

  // For assigned events
  useEffect(() => {
    if (user && user.sub) {
      const getAssignedEventIds = async () => {
        try {
          const [assignedResponse, completedResponse] = await Promise.all([
            axios.get(`http://localhost:3001/api/events/getevents/${user.sub}`),
            axios.get(`http://localhost:3001/api/events/getcompletedevents/${user.sub}`)
          ]);
          setAssignedEventIds(assignedResponse.data);
          setCompletedEventIds(completedResponse.data);
        } catch (e) {
          console.log('Error getting assigned events: ', e);
        }
      };
      getAssignedEventIds();
    }
  }, [user]);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const eventDetails = await Promise.all(
          assignedEventIds.map(async (eventId) => {
            const response = await axios.get(`http://localhost:3001/api/events/geteventbyid/${eventId}`);
            return response.data;
          })
        );
        setAssignedEvents(eventDetails);
      } catch (e) {
        console.log('Error fetching event details: ', e);
      }
    };
    if (assignedEventIds.length > 0) {
      getEventDetails();
    } else {
      setAssignedEvents([]);
    }
  }, [assignedEventIds]);

  // For completed events
  const handleCompleteEvent = async (eventId) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/events/complete`, {
        userId: user.sub,
        eventId: eventId
      });
      setAssignedEventIds(response.data.assignedEvents);
      setCompletedEventIds(response.data.completedEvents);
    } catch (e) {
      console.log('Error completing event: ', e);
    }
  };

  useEffect(() => {
    const getCompletedEventDetails = async () => {
      try {
        const eventDetails = await Promise.all(
          completedEventIds.map(async (eventId) => {
            const response = await axios.get(`http://localhost:3001/api/events/geteventbyid/${eventId}`);
            return response.data;
          })
        );
        setCompletedEvents(eventDetails);
      } catch (e) {
        console.log('Error fetching completed event details: ', e);
      }
    };
    if (completedEventIds.length > 0) {
      getCompletedEventDetails();
    } else {
      setCompletedEvents([]);
    }
  }, [completedEventIds]);

  const isEventPast = (eventDate) => {
    const today = new Date();
    const eventDay = new Date(eventDate);
    return eventDay < today;
  };

  const formatLocation = (location) => {
    return `${location.streetAddress}, ${location.city}, ${location.state} ${location.zipCode}`;
  };

  const formatDate = (dateString) => {
    return dateString.split('T')[0]; // Extract only the date part
  };

  return (
    <div className="container">
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: '2rem', fontFamily: 'monospace', padding: '2rem' }}>
        User Dashboard
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
        <section className="events-section">
          <h2>
            <Link className='link' to='/userprofileform'>Edit Profile</Link>
          </h2>
          <div className="event-card">
            <h3 style={{ textAlign: 'center' }}>{profile ? profile.fullName : 'User name'}</h3>
            <p>{profile ? `${profile.location.address1}, ${profile.location.city}, ${profile.location.state} ${profile.location.zipCode}` : 'User Address'}</p>
            <p><strong>Skills:</strong> {profile ? profile.skills.join(', ') : 'User Skills'}</p>
          </div>
        </section>

        <section className="events-section">
          <h2>Current Assigned Events</h2>
          {assignedEvents.map((event) => (
            <div key={event._id} className="event-card">
              <h3 style={{ textAlign: 'center' }}>{event.eventName}</h3>
              <p>{formatLocation(event.location)}</p>
              <p><strong>Date:</strong>{formatDate(event.date)}</p>
              <button
                onClick={() => handleCompleteEvent(event._id)}
                disabled={!isEventPast(event.date)}
              >
                {isEventPast(event.date) ? 'Complete' : 'Not Completed Yet'}
              </button>
            </div>
          ))}
        </section>

        <section className="events-section">
          <h2>Completed Events</h2>
          <ul className="events-list">
            {completedEvents.map(event => (
              <li key={event._id} className="event-card">
                <h3 style={{ textAlign: 'center' }}>{event.eventName}</h3>
                <p>{formatLocation(event.location)}</p>
                <p><strong>Date:</strong> {formatDate(event.date)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default User;
