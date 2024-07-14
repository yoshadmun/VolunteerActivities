import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const {user} = useAuth0();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user && user.sub){
            console.log(`${user.sub}`);
            const getNoti = async() => {
                try{
                    const response = await axios.get(`http://localhost:3001/api/notifications/user/${user.sub}`);
                    setNotifications(response.data);
                } catch(error){
                    console.log('Error getting notifications: ', error.data);
                } finally {
                    setLoading(false);
                }
            };
            getNoti();
        }
    }, [user]);

    const checkNotifications = (type) => {
        if (!Array.isArray(notifications)) {
            return <li>Error loading notifications</li>;
          }
        const filterNotifications = notifications.filter(notification => notification.type === type);
        if(filterNotifications.length === 0){
            return <li>No new {type} notifications</li>;
        }
        return filterNotifications.map((notification, index)=>(
            <li key={index}>{notification.message}</li>
        ));
    };

    if(loading){
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
                        {/* New Events will be dynamically populated here using JavaScript Backend */}
                    </ul>
                </section>

                <section className="notification-section">
                    <h2>Event Updates</h2>
                    <ul className="notification-list">
                        {checkNotifications('update')}
                        {/* Event Updates will be dynamically populated here using JavaScript Backend */}
                    </ul>
                </section>

                <section className="notification-section">
                    <h2>Reminders</h2>
                    <ul className="notification-list">
                        {checkNotifications('reminder')}
                        {/* Reminders will be dynamically populated here using JavaScript Backend */}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Notifications;
