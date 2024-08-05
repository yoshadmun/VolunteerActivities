import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [assignmentPage, setAssignmentPage] = useState(1);
    const [updatePage, setUpdatePage] = useState(1);
    const [reminderPage, setReminderPage] = useState(1);
    const { user } = useAuth0();
    const [loading, setLoading] = useState(true);
    const pageSize = 5; // Number of notifications per page
    const isFetching = useRef(false);

    useEffect(() => {
        if (user && user.sub) {
            const fetchNotifications = async () => {
                if (isFetching.current) return;
                isFetching.current = true;
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
                    isFetching.current = false;
                }
            };
            fetchNotifications();
        }
    }, [user]);

    const getNotificationsByType = (type, page) => {
        const filteredNotifications = notifications.filter(notification => notification.type === type);
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        return filteredNotifications.slice(startIndex, endIndex);
    };

    const handleDeleteNotification = async (notiId) => {
        try {
            await axios.delete(`http://localhost:3001/api/notifications/delete/${notiId}`);
            setNotifications(notifications.filter(notification => notification._id !== notiId));
        } catch (error) {
            console.log('Error deleting notification: ', error);
        }
    };

    const renderNotificationsTable = (type, title, page, setPage) => {
        const notificationsByType = getNotificationsByType(type, page);
        const totalNotifications = notifications.filter(notification => notification.type === type).length;

        return (
            <section className="notification-section">
                <h2 style={{color:'black'}}>{title}</h2>
                <table>
                    <thead>
                        <tr>
                            <th style={{color:'black'}}>Message</th>
                            <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notificationsByType.map((notification, index) => (
                            <tr key={index}>
                                <td>{notification.message}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => handleDeleteNotification(notification._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {notificationsByType.length === 0 && (
                            <tr>
                                <td colSpan="2">No new {type} notifications</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>

                    <span>{notificationsByType.length === 0
                        ? "Page 0 of 0"
                        : `Page ${page} of ${Math.ceil(totalNotifications / pageSize)}`}
                    </span>
                    <button disabled={page === Math.ceil(totalNotifications / pageSize)} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            </section>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <Header />
            <h2 className="notification-header" style={{color:'black', fontSize:'3rem'}}>Notifications</h2>
            <div className="notifications-content">
                {renderNotificationsTable('assignment', 'New Event Assignments', assignmentPage, setAssignmentPage)}
                {renderNotificationsTable('update', 'Event Updates', updatePage, setUpdatePage)}
                {renderNotificationsTable('reminder', 'Reminders', reminderPage, setReminderPage)}
            </div>
        </div>
    );
};

export default Notifications;
