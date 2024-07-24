import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const VolunteerHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth0();

    useEffect(() => {
        if (user && user.sub) {
            const getHistory = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/volunteerHistory/user/${user.sub}`);
                    setHistory(Array.isArray(response.data) ? response.data : []);
                } catch (e) {
                    console.log('Error getting volunteer history: ', e);
                    setHistory([]); // Set history to an empty array in case of error
                } finally {
                    setLoading(false);
                }
            };
            getHistory();
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>
    }
    const formatLocation = (location) => {
        return `${location.streetAddress}, ${location.city}, ${location.state}, ${location.zipCode}`;
      };
    const formatDate = (dateString) => {
        return dateString.split('T')[0]; // Extract only the date part
      };
    return (
        <div className="container">
            <Header />
            <div style={{ display: 'flex', justifyContent: 'center', fontSize: '2rem', fontFamily: 'monospace', padding: '2rem' }}>Volunteer History</div>
            <table>
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Location</th>
                        <th>Event Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No participation history available.</td>
                        </tr>
                    ) : (
                        history.map((event, index) => (
                            <tr key={index}>
                                <td>{event.eventName}</td>
                                <td>{formatLocation(event.location) || 'N/A'}</td>
                                <td>{formatDate(event.date)}</td>
                                <td>{event.status}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VolunteerHistory;
