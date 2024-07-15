import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth0();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.sub) {
            const fetchNotifications = async () => {
                try {
                    // Check and send reminders
                    await axios.post(`http://localhost:3001/api/notifications/reminder/${user.sub}`);
                    // Fetch all notifications
                    const response = await axios.get(`http://localhost:3001/api/notifications/user/${user.sub}`);
                    setNotifications(response.data);
                } catch (error) {
                    console.log('Error getting notifications: ', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchNotifications();
        }
    }, [user]);

    const checkNotifications = (type) => {
        if (!Array.isArray(notifications)) {
            return <li>Error loading notifications</li>;
        }
        const filteredNotifications = notifications.filter(notification => notification.type === type);
        if (filteredNotifications.length === 0) {
            return <li>No new {type} notifications</li>;
        }
        return filteredNotifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
        ));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <Header />
            <div className="notification-header">Notifications</div>
            <div className="notifications-content">
                <section className="notification-section">
                    <h2>New Event Assignments</h2>
                    <ul className="notification-list">
                        {checkNotifications('assignment')}
                    </ul>
                </section>

                <section className="notification-section">
                    <h2>Event Updates</h2>
                    <ul className="notification-list">
                        {checkNotifications('update')}
                    </ul>
                </section>

                <section className="notification-section">
                    <h2>Reminders</h2>
                    <ul className="notification-list">
                        {checkNotifications('reminder')}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Notifications;
