const volunteers = require('../data/volunteers'); // Assume this is an array of volunteer objects
const events = require('../data/events');
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');

/*const getEventDetails = (eventIds) => {
  return eventIds.map(eventId => events.find(e => e.id === eventId)).filter(e => e);
};

const getVolunteers = (req, res) => {
  const { search = '', page = 1, pageSize = 10 } = req.query;

  const filteredVolunteers = volunteers.filter(v =>
    v.active && v.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedVolunteers = filteredVolunteers.slice((page - 1) * pageSize, page * pageSize);

  const volunteersWithEvents = paginatedVolunteers.map(volunteer => ({
    ...volunteer,
    assignedEvents: getEventDetails(volunteer.assignedEvents),
    completedEvents: getEventDetails(volunteer.completedEvents),
  }));

  res.json({
    volunteers: volunteersWithEvents,
    total: filteredVolunteers.length,
  });
};


//remove volunteer and also update event's assignedVolunteers []
const removeVolunteer = (req,res) => {
  const {volunteerId} = req.params;
  const {active} = req.body;

  const volunteer = volunteers.find(v => v.userId.toString() === volunteerId);
  if(!volunteer){
    res.status(404).json({message:'Volunteer not found'});
  }
  volunteer.active = active;

  //remove volunteer from assignedEvents
  if(!active){
    events.forEach(event => {
      if(event.assignedVolunteers.includes(volunteer.userId)){
        event.assignedVolunteers = event.assignedVolunteers.filter(id => id !== volunteer.userId);
      }
    });
  }
  res.status(200).json({message:'Volunteer status updated', volunteer});
};*/

const getEventDetails = async (eventIds) => {
  return await Event.find({_id: {$in: eventIds}});
}

const getVolunteers = async (req,res) => {
  const {search ='', page=1, pageSize=10} = req.query;

  try{
    const filter = {active:true, fullName: new RegExp(search, 'i')};
    const total = await UserProfile.countDocuments(filter);
    const volunteers = await UserProfile.find(filter)
      .skip((page-1) * pageSize)
      .limit(parseInt(pageSize))
      .populate("assignedEvents completedEvents");
    console.log(volunteers);
    res.json({volunteers, total});
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeVolunteer = async (req,res) => {
  const {volunteerId} = req.params;
  const {active} = req.body;
  try{
    const volunteer = await UserProfile.findOne({userId: volunteerId});
    if(!volunteer){
      return res.status(404).json({message:'Volunteer not found'});
    }
    volunteer.active = active;
    await volunteer.save();
    if(!active){
      await Event.updateMany(
        {assignedVolunteers: volunteerId},
        {$pull: {assignedVolunteers: volunteerId}}
      );
    }
    res.status(200).json({message:'Volunteer status updated', volunteer});
  } catch (error) {
    console.error('Error removing volunteer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getVolunteers,
  removeVolunteer,
};
