const events = require('../data/events');
const volunteers = require('../data/volunteers');
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');

/*const getEventsMatchingSkills = (req, res) => {
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
      !volunteer.completedEvents.includes(event.id) &&
      event.active
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
  } else{
    return res.status(400).json({message: 'Volunteer is already assigned to event'});
  } 

  if (!volunteer.assignedEvents) {
    volunteer.assignedEvents = [];
  }
  if (!volunteer.assignedEvents.includes(event.id)) {
    volunteer.assignedEvents.push(event.id);
  } else{
    return res.status(400).json({message: 'Event has been already assigned to volunteer'});
  }

  res.status(200).json({ message: 'Volunteer assigned to event successfully' });
};*/

const getEventsMatchingSkills = async (req, res) => {
  const {volunteerId} = req.params;
  try{
    const volunteer = await UserProfile.findOne({userId: volunteerId});
    if(!volunteer) {
      return res.status(404).json({message: 'Volunteer not found'});
    }
    const matchingEvents = await Event.find({
      requiredSkills: {$in: volunteer.skills},
      date: {$gte: new Date(volunteer.availability)},
      active: true,
      _id: {$nin: volunteer.completedEvents}
    });
    res.json(matchingEvents || []);
  } catch (e) {
    console.error('Error fetching matching events:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const assignVolunteerToEvent = async (req,res) => {
  const {volunteerId, eventId} = req.body;
  try{
    const volunteer = await UserProfile.findOne({userId: volunteerId});
    const event = await Event.findById(eventId);

    if(!volunteer || !event){
      return res.status(404).json({message:'Event or Volunteer not found'});
    }
    // Check if the volunteer is already assigned to the event
    if (!event.assignedVolunteers.includes(volunteerId)){
      event.assignedVolunteers.push(volunteerId);
    } else{
      return res.status(400).json({message:'Volunteer is already assigned to event'});
    }
    // Check if the event is already assigned to the volunteer
    if(!volunteer.assignedEvents.includes(eventId)){
      volunteer.assignedEvents.push(eventId);
    } else{
      return res.status(400).json({message:'Event has been already assigned to volunteer'})
    }
    //Save the updated
    await event.save();
    await volunteer.save();
    res.status(200).json({message:'Volunteer assigned to event successfully'});
  } catch (e) {
    console.error('Error assigning volunteer to event:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getEventsMatchingSkills, assignVolunteerToEvent };
