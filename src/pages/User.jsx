import React, { useState,useEffect } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const User = () => {
  // Mock data for demonstration
  const newEvents = [
    { id: 1, name: 'Tree Planting', description: 'Planting trees in the local park.', date: 'July 1, 2024' },
    { id: 2, name: 'Beach Cleanup', description: 'Cleaning the beach area.', date: 'July 3, 2024' },
    { id: 3, name: 'Food Distribution', description: 'Distributing food to the homeless.', date: 'July 5, 2024' },
  ];

  const currentAssignedEvent = {
    id: 4, 
    name: 'Community Health Camp', 
    description: 'Health checkups and awareness.', 
    date: 'July 10, 2024'
  };

  const completedEvents = [
    { id: 5, name: 'School Renovation', description: 'Painting and fixing school facilities.', date: 'June 15, 2024' },
    { id: 6, name: 'Elderly Care Visit', description: 'Spending time with the elderly.', date: 'June 20, 2024' },
  ];

  const {user} = useAuth0();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user && user.sub) {
      const getProfile = async () => {
        try {
          console.log(user.sub);
          const response = await axios.get(`http://localhost:3001/api/user-profile/${user.sub}`);
          setProfile(response.data);
          console.log(response.data);
        } catch (error) {
          console.log('Error getting profile data: ', error);
        }
      };
      getProfile();
    }
  }, [user]);

  return (
    <div className="container">
        <Header/>
      <div style={{display:'flex',justifyContent:'center',fontSize:'2rem',fontFamily:'monospace',padding:'2rem'}}>User Dashboard</div>  
      <div style={{display:'flex',justifyContent:'space-around',flexDirection:'row'}}>

      <section className="events-section">
        <h2>
          <Link className='link'to='/userprofileform'>Edit Profile</Link>
        </h2>
        <div className="event-card">
            <h3 style={{ textAlign: 'center' }}>{profile ? profile.fullName : 'User name'}</h3>
            <p>{profile ? `${profile.location.address1}, ${profile.location.city}, ${profile.location.state} ${profile.location.zipCode}` : 'User Address'}</p>
            <p><strong>Skills:</strong> {profile ? profile.skills.join(', ') : 'User Skills'}</p>
        </div>
      </section>

      <section className="events-section">
        <h2>Current Assigned Event</h2>
        <div className="event-card">
          <h3 style={{textAlign:'center'}}>{currentAssignedEvent.name}</h3>
          <p>{currentAssignedEvent.description}</p>
          <p><strong>Date:</strong> {currentAssignedEvent.date}</p>
        </div>
      </section>

      <section className="events-section">
        <h2>Completed Events</h2>
        <ul className="events-list">
          {completedEvents.map(event => (
            <li key={event.id} className="event-card">
              <h3 style={{textAlign:'center'}}>{event.name}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {event.date}</p>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </div>
  );
};

export default User;
