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
              </tr>
            </thead>
            <tbody>
              {volunteers.map(volunteer => (
                <tr key={volunteer.id}>
                  <td>{volunteer.fullName}</td>
                  <td>{volunteer.skills.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination" style={{padding:'1rem'}}>
          <button disabled={volunteerPage === 1} onClick={() => setVolunteerPage(volunteerPage - 1)}>Previous</button>
          <span>Page {volunteerPage} of {Math.ceil(volunteerTotal / pageSize)}</span>
          <button disabled={volunteerPage === Math.ceil(volunteerTotal / pageSize)} onClick={() => setVolunteerPage(volunteerPage + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ViewVolunteerProfiles;
