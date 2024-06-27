import React from 'react';
import Header from '../components/Header';


const Notifications = () => {
    return (
        <div className="container">
            <Header />
            <div className="notification-header">Notifications</div>
            <div className="notifications-content">
                <section className="notification-section">
                    <h2>New Event Assignments</h2>
                    <ul className="notification-list">
                        <li>You have been assigned to the "Community Clean-Up" event on June 25, 2024.</li>
                        {/* New Events will be dynamically populated here using JavaScript Backend */}
                    </ul>
                </section>

                <section className="notification-section">
                    <h2>Event Updates</h2>
                    <ul className="notification-list">
                        <li>The "Food Drive" event on June 30, 2024 has been updated with new details.</li>
                        {/* Event Updates will be dynamically populated here using JavaScript Backend */}
                    </ul>
                </section>

                <section className="notification-section">
                    <h2>Reminders</h2>
                    <ul className="notification-list">
                        <li>"Health Awareness Camp" event on July 5, 2024.</li>
                        {/* Reminders will be dynamically populated here using JavaScript Backend */}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Notifications;
