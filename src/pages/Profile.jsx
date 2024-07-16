import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';

function ViewVolunteerProfiles() {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerPage, setVolunteerPage] = useState(1);
  const [volunteerTotal, setVolunteerTotal] = useState(0);

  const pageSize = 20;

  useEffect(() => {
    axios.get(`http://localhost:3001/api/volunteers?search=${volunteerSearch}&page=${volunteerPage}&pageSize=${pageSize}`)
      .then(response => {
        setVolunteers(response.data.volunteers);
        setVolunteerTotal(response.data.total);
      })
      .catch(error => {
        console.error('Error fetching volunteers:', error);
      });
  }, [volunteerSearch, volunteerPage]);

  const handleVolunteerChange = selectedOption => {
    const volunteer = volunteers.find(v => v.id === selectedOption.value);
    setSelectedVolunteer(volunteer);
  };

  const handleRemoveVolunteer = async (userId) =>{
    try{
      await axios.put(`http://localhost:3001/api/volunteers/remove/${userId}/active`,{active:false});
      setVolunteers(volunteers.filter(v => v.userId !== userId)); // Remove from the current list in state
    } catch (error) {
      console.error('Error removing volunteer:', error);
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="profiles-container">
        <h2>View Volunteer Profiles</h2>
        <div className="search-container" style={{padding:'1rem',display:'flex'}}>
          <input
            className="search-input"
            type="text"
            placeholder="Search Volunteers..."
            value={volunteerSearch}
            onChange={e => setVolunteerSearch(e.target.value)}
          />
        </div>
        {selectedVolunteer && (
          <div>
            <h3>Volunteer Profile</h3>
            <p><strong>Name:</strong> {selectedVolunteer.fullName}</p>
            <p><strong>Skills:</strong> {selectedVolunteer.skills.join(', ')}</p>
          </div>
        )}
        <div>
          <h2>All Volunteers</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Skills</th>
                <th>Assigned Events</th>
                <th>Completed Events</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map(volunteer => (
                <tr key={volunteer.id}>
                  <td>{volunteer.fullName}</td>
                  <td>{volunteer.skills.join(', ')}</td>
                  <td>
                    {volunteer.assignedEvents.length > 0 ? (
                      volunteer.assignedEvents.map(event => event.eventName).join(', ')
                    ) : (
                      <span style={{ color: 'gray' }}>Nothing</span>
                    )}
                  </td>
                  <td>
                    {volunteer.completedEvents.length > 0 ? (
                      volunteer.completedEvents.map(event => event.eventName).join(', ')
                    ) : (
                      <span style={{ color: 'gray' }}>Nothing</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleRemoveVolunteer(volunteer.userId)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination" style={{padding:'1rem'}}>
          <button disabled={volunteerPage === 1} onClick={() => setVolunteerPage(volunteerPage - 1)}>Previous</button>
          <span>{volunteers.length === 0
                      ? "Page 0 of 0"
                    : `Page ${volunteerPage} of ${Math.ceil(volunteerTotal / pageSize)}`}
          </span>
          <button disabled={volunteerPage === Math.ceil(volunteerTotal / pageSize)} onClick={() => setVolunteerPage(volunteerPage + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ViewVolunteerProfiles;
