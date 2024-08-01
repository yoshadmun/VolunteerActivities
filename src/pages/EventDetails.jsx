import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await axios.get(`http://localhost:3001/api/events/geteventbyid/${eventId}`);
        setEvent(eventResponse.data);

        const volunteersResponse = await axios.get(`http://localhost:3001/api/volunteers/getvolunteers?eventId=${eventId}`);
        setVolunteers(Array.isArray(volunteersResponse.data) ? volunteersResponse.data : []);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const formatLocation = (location) => {
    return `${location.streetAddress}, ${location.city}, ${location.state}, ${location.zipCode}`;
  };

  const formatDate = (dateString) => {
    return dateString.split('T')[0]; // Extract only the date part
  };

  const getVolunteerNames = () => {
    return volunteers.map(volunteer => volunteer.fullName).join(', ');
  };

  const downloadCSV = async () => {
    const response = await axios.get('http://localhost:3001/api/reports/events', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'volunteers_report.csv');
    document.body.appendChild(link);
    link.click();
  };

  const downloadPDF = async () => {
    const response = await axios.get('http://localhost:3001/api/reports/events', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'volunteers_report.pdf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container">
      <Header />
      <div>
        <h2 style={{fontSize:'4.5rem', color:'darkslateblue'}}>{event.eventName}</h2>
        <p style={{fontSize:'1.5rem', color:'darkslateblue'}}><strong>Description:</strong> {event.eventDescription}</p>
        <p style={{fontSize:'1.5rem', color:'darkslateblue'}}><strong>Location:</strong> {formatLocation(event.location)}</p>
        <p style={{fontSize:'1.5rem', color:'darkslateblue'}}><strong>Date:</strong> {formatDate(event.date)}</p>
        <p style={{fontSize:'1.5rem', color:'darkslateblue'}}><strong>Required Skills:</strong> {event.requiredSkills.join(', ')}</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px', fontSize: '2rem', color: 'black' }}>Assigned Volunteers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '8px', fontSize: '1.5rem', color: 'black' }}>
                {volunteers.length > 0 ? getVolunteerNames() : 'None'}
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={downloadPDF} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1.5rem', backgroundColor: 'darkslateblue', color: 'white', border: 'none', cursor: 'pointer' }}>
          Generate Report
        </button>
      </div>
    
    </div>
  );
};

export default EventDetails;
