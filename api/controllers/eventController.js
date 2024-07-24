const events = require('../data/events'); // Assume this is an array of event objects
const volunteers = require('../data/volunteers');
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');

/*const getEvents = (req, res) => {
  const { search = '', page = 1, pageSize = 10 } = req.query;
 
  // Filter events based on search term
  const filteredEvents = events.filter(e =>
    e.active && e.eventName.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate the filtered results
  const paginatedEvents = filteredEvents.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    events: paginatedEvents,
    total: filteredEvents.length,
  });
};


const createEvent = (req, res) => {
  const newEvent = { ...req.body, id: events.length + 1 };
  events.push(newEvent);
  res.status(201).json(newEvent);

const getAssignedEvents = (req,res) => {
  const {volunteerId} = req.params;
  const volunteer = volunteers.find(v=> v.userId.toString() === volunteerId);
  if(!volunteer){
    return res.status(404).json({'Voluteer not found: ': volunteerId});
  }
  res.json(volunteer.assignedEvents);
};

const getCompletedEvents = (req,res) => {
  const {volunteerId} = req.params;
  const volunteer = volunteers.find(v => v.userId.toString() === volunteerId);
  if(!volunteer){
    return res.status(404).json({'Volunteer not found: ': volunteerId});
  }
  res.json(volunteer.completedEvents);
}

const getEventById = (req,res) => {
  const {eventId} = req.params;
  const event = events.find(e=>e.id.toString() === eventId);
  if(event){
    res.json(event);
  } else{
    res.status(404).json({message: 'Even not found'});
  }
};

const completeEvent = (req,res) => {
  const {userId, eventId} = req.body;
  const volunteer = volunteers.find(v => v.userId.toString() === userId);
  if(!volunteer){
    return res.status(401).json({message:'Volunteer not found'});
  }
  const eventIndex = volunteer.assignedEvents.findIndex(e => e === eventId);
  if (eventIndex === -1){
    return res.status(400).json({message: 'Event not found in assigned events'});
  }
  const completedEvent = volunteer.assignedEvents.splice(eventIndex,1)[0];
  volunteer.completedEvents.push(completedEvent);

  res.status(200).json({
    message: 'Event marked as completed',
    assignedEvents: volunteer.assignedEvents,
    completedEvents: volunteer.completedEvents
  });
};

const getCompletedEventById = (req, res) => {
  const {eventId} = req.params;
  const event = events.find( e => e.id.toString() === eventId);
  if(event){
    res.json(event);
  } else{
    res.status(404).json({message: 'Even not found'});
  }
};

const removeEvent = (req,res) => {
  const {eventId} = req.params;
  const {active} = req.body;

  const event = events.find(e => e.id.toString() === eventId);
  if(!event) {
    res.status(404).json({message:'Event not found'});
  }

  event.active = active;

  //remove event from assignedEvents
  if(!active){
    volunteers.forEach(volunteer => {
      if(volunteer.assignedEvents.includes(event.id)){
        volunteer.assignedEvents = volunteer.assignedEvents.filter(id => id !== event.id);
      }
    });
  }
  res.status(200).json({message:'Event status updated', event})
};
};*/

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
      return res.status(404).json({messaga:'Volunteer not found'});
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

const getCompletedEventById = async (req,res) => {
  const {eventId} = req.params;
  try{
    const event = await Event.findById(eventId);
    if(!event){
      res.status(404).json({message:'Event not found'});
    }
    res.json(event);
  } catch (e) {
    console.log('Error fetching completed event by ID: ', e);
    res.status(500).json({message:'Internal server error'});
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
  getCompletedEventById,
  getCompletedEvents,
  removeEvent,
};
