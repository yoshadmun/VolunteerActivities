const volunteers = require('../data/volunteers'); // Update with the correct path to your data
const events = require('../data/events'); // Import the events data

const getVolunteerHistory = (req, res) => {
  const { volunteerId } = req.params;
  const volunteer = volunteers.find(v => v.userId.toString() === volunteerId);
  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found' });
  }
  const completedEvents = volunteer.completedEvents.map(eventId => {
    const event = events.find(e => e.id === eventId);
    return {
      eventName: event.eventName,
      location: event.location,
      date: event.date,
      status: 'Completed'
    };
  });
  res.json(completedEvents);
};

module.exports = { getVolunteerHistory };
