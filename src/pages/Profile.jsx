// src/pages/ViewVolunteerProfiles.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchVolunteers } from '../MockAPI';
import Header from '../components/Header';

function ViewVolunteerProfiles() {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerPage, setVolunteerPage] = useState(1);
  const [volunteerTotal, setVolunteerTotal] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    fetchVolunteers(volunteerSearch, volunteerPage, pageSize).then(response => {
      setVolunteers(response.data);
      setVolunteerTotal(response.total);
    });
  }, [volunteerSearch, volunteerPage]);

  const volunteerOptions = volunteers.map(volunteer => ({
    value: volunteer.id,
    label: volunteer.name,
  }));

  const handleVolunteerChange = selectedOption => {
    const volunteer = volunteers.find(v => v.id === selectedOption.value);
    setSelectedVolunteer(volunteer);
  };

  return (
    <div className="container">
      <Header />
      <div className="content">
        <h2>View Volunteer Profiles</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Volunteers..."
            value={volunteerSearch}
            onChange={e => setVolunteerSearch(e.target.value)}
          />
        </div>
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
        <div className="pagination">
          <button disabled={volunteerPage === 1} onClick={() => setVolunteerPage(volunteerPage - 1)}>Previous</button>
          <span>Page {volunteerPage} of {Math.ceil(volunteerTotal / pageSize)}</span>
          <button disabled={volunteerPage === Math.ceil(volunteerTotal / pageSize)} onClick={() => setVolunteerPage(volunteerPage + 1)}>Next</button>
        </div>
        {selectedVolunteer && (
          <div className="volunteer-profile">
            <h3>Volunteer Profile</h3>
            <p><strong>Name:</strong> {selectedVolunteer.name}</p>
            <p><strong>Skills:</strong> {selectedVolunteer.skills.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewVolunteerProfiles;
