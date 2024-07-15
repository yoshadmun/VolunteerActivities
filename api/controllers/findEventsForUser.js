const events = require('../data/events');
const volunteers = require('../data/volunteers');

const getEventsMatchingSkills = (req, res) => {
  const { volunteerId } = req.params;
  const volunteer = volunteers.find(v => v.userId.toString() === volunteerId);

  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found' });
  }
  
  const volunteerAvailability = new Date(volunteer.availability);
  const matchingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return(
      event.requiredSkills.some(skill => volunteer.skills.includes(skill)) &&
      eventDate >= volunteerAvailability &&
      !volunteer.completedEvents.includes(event.id)
    );
  });

  res.json(matchingEvents);
};

const assignVolunteerToEvent = (req, res) => {
  const { volunteerId, eventId } = req.body;

  const volunteer = volunteers.find(v => v.userId.toString() === volunteerId);
  const event = events.find(e => e.id === eventId);

  if (!volunteer || !event) {
    return res.status(404).json({ message: 'Volunteer or Event not found' });
  }

  if (!event.assignedVolunteers) {
    event.assignedVolunteers = [];
  }
  if (!event.assignedVolunteers.includes(volunteer.userId)) {
    event.assignedVolunteers.push(volunteer.userId);
  }

  if (!volunteer.assignedEvents) {
    volunteer.assignedEvents = [];
  }
  if (!volunteer.assignedEvents.includes(event.id)) {
    volunteer.assignedEvents.push(event.id);
  }

  res.status(200).json({ message: 'Volunteer assigned to event successfully' });
};

module.exports = { getEventsMatchingSkills, assignVolunteerToEvent };
