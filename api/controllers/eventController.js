const events = require('../data/events'); // Assume this is an array of event objects
const volunteers = require('../data/volunteers');

const getEvents = (req, res) => {
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
};

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
