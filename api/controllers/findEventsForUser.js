const mongoose = require('mongoose');
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');
const { isValidObjectId } = mongoose;

const getEventsMatchingSkills = async (req, res) => {
  const { volunteerId } = req.params;
  const today = new Date();
  try {
    const volunteer = await UserProfile.findOne({ userId: volunteerId });
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    const matchingEvents = await Event.find({
      requiredSkills: { $in: volunteer.skills },
      date: { $gte: today },
      active: true,
      _id: { $nin: volunteer.completedEvents },
    });
    res.json(matchingEvents || []);
  } catch (e) {
    console.error('Error fetching matching events:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const assignVolunteerToEvent = async (req, res) => {
  const { volunteerId, eventId } = req.body;

  if (!isValidObjectId(eventId)) {
    return res.status(404).json({ message: 'Event or Volunteer not found' });
  }

  try {
    const volunteer = await UserProfile.findOne({ userId: volunteerId });
    const event = await Event.findById(eventId);

    if (!volunteer || !event) {
      return res.status(404).json({ message: 'Event or Volunteer not found' });
    }

    // Check if the volunteer is already assigned to the event
    if (!event.assignedVolunteers.includes(volunteer.userId)) {
      event.assignedVolunteers.push(volunteer.userId);
    } else {
      return res.status(400).json({ message: 'Volunteer is already assigned to event' });
    }

    // Check if the event is already assigned to the volunteer
    if (!volunteer.assignedEvents.includes(event._id)) {
      volunteer.assignedEvents.push(event._id);
    } else {
      return res.status(400).json({ message: 'Event has been already assigned to volunteer' });
    }

    // Save the updated
    await event.save();
    await volunteer.save();
    res.status(200).json({ message: 'Volunteer assigned to event successfully' });
  } catch (e) {
    console.error('Error assigning volunteer to event:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getEventsMatchingSkills, assignVolunteerToEvent };
