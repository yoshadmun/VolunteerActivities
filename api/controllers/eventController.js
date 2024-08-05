const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');

const getEvents = async (req, res) => {
  const { search = '', page = 1, pageSize = 10 } = req.query;
  
  try {
    const query = { active: true, eventName: { $regex: search, $options: 'i' } };
    const events = await Event.find(query)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      total,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createEvent = async (req,res) => {
  const newEvent = new Event(req.body);
  try{
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (e) {
    console.log('Error creating new event: ', e);
    res.status(500).json({message: 'Internal server error'});
  }
};

const getAssignedEvents = async (req,res) => {
  const {volunteerId} = req.params;
  try{
    const volunteer = await UserProfile.findOne({userId: volunteerId});
    if(!volunteer){
      return res.status(404).json({message:'Volunteer not found'});
    }
    res.json(volunteer.assignedEvents);
  } catch (e) {
    console.log('Error fetching assigned events: ', e);
    res.status(500).json({message:'Internal server error'});
  }
};

const getCompletedEvents = async (req,res) => {
  const {volunteerId} = req.params;
  try{
    const volunteer = await UserProfile.findOne({userId: volunteerId});
    if(!volunteer) {
      return res.status(404).json({message:'Volunteer not found'});
    }
    res.json(volunteer.completedEvents);
  } catch (e) {
    console.log('Error fetching completed events: ', e);
    res.status(500).json({message:'Internal server error'});
  }
};

const getEventById = async (req,res) => {
  const {eventId} = req.params;
  try {
    const event = await Event.findById(eventId);
    if(!event){
      return res.status(404).json({message:'Event not found'});
    }
    res.json(event);
  } catch (e) {
    console.log('Error fetching event by ID: ', e);
    res.status(500).json({message:'Internal server error'});
  }
};

const completeEvent = async (req,res) => {
  const {userId, eventId} = req.body;
  try {
    console.log(userId, eventId);
    const volunteer = await UserProfile.findOne({userId: userId});
    if(!volunteer){
      return res.status(401).json({message:'Volunteer not found'});
    }
    const eventIndex = volunteer.assignedEvents.findIndex(e => e.toString() === eventId);
    if (eventIndex === -1) {
      return res.status(400).json({message:'Event not found in assigned events'});
    }
    const completedEvent = volunteer.assignedEvents.splice(eventIndex,1)[0];
    volunteer.completedEvents.push(completedEvent);
    await volunteer.save();

    res.status(200).json({
      message: 'Event marked as completed',
      assignedEvents: volunteer.assignedEvents,
      completedEvents: volunteer.completedEvents,
    });
  } catch (error) {
    console.error('Error completing event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeEvent = async (req,res) => {
  const {eventId} = req.params;
  const {active} = req.body;

  try {
    console.log('Received eventId:', eventId); // Log the event ID received

    const event = await Event.findById(eventId);
    if(!event){
      return res.status(404).json({message:'Event not found'});
    }
    event.active = active;
    await event.save();

    if(!active){
      await UserProfile.updateMany(
        {assignedEvents: eventId},
        {$pull: {assignedEvents: eventId}}
      );
    }
    res.status(200).json({message:'Event status updated', event});
  } catch (e) {
    console.error('Error removing event:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  getAssignedEvents,
  getEventById,
  completeEvent,
  getCompletedEvents,
  removeEvent,
};
