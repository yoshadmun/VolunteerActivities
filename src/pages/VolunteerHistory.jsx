import React from 'react';
import Header from '../components/Header';

const VolunteerHistory = () => {
    return (
        <div className="container">
            <Header/>
            <div style={{display:'flex',justifyContent:'center',fontSize:'2rem',fontFamily:'monospace',padding:'2rem'}}>Volunteer History</div>
            <table>
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Event Description</th>
                        <th>Location</th>
                        <th>Required Skills</th>
                        <th>Urgency</th>
                        <th>Event Date</th>
                        <th>Participation Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Community Clean-Up</td>
                        <td>Cleaning the neighborhood park and surrounding areas.</td>
                        <td>Park Street, Springfield</td>
                        <td>Cleaning, Organizing</td>
                        <td>High</td>
                        <td>June 25, 2024</td>
                        <td>Participated</td>
                    </tr>
                    <tr>
                        <td>Food Drive</td>
                        <td>Collecting and distributing food to those in need.</td>
                        <td>Main Street, Springfield</td>
                        <td>Organizing, Communication</td>
                        <td>Medium</td>
                        <td>June 30, 2024</td>
                        <td>Participated</td>
                    </tr>
                    <tr>
                        <td>Health Awareness Camp</td>
                        <td>Raising awareness about health and wellness.</td>
                        <td>Central Park, Springfield</td>
                        <td>Communication, Medical Assistance</td>
                        <td>Low</td>
                        <td>July 5, 2024</td>
                        <td>Not Participated</td>
                    </tr>
                    <tr>
                        <td>Health Awareness Camp</td>
                        <td>Raising awareness about health and wellness.</td>
                        <td>Central Park, Springfield</td>
                        <td>Communication, Medical Assistance</td>
                        <td>Low</td>
                        <td>July 5, 2024</td>
                        <td>Not Participated</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default VolunteerHistory;
