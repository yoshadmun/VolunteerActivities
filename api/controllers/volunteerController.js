const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');

const getVolunteers = async (req,res) => {
  const {search ='', page=1, pageSize=10} = req.query;

  try{
    const filter = {active:true, fullName: new RegExp(search, 'i')};
    const total = await UserProfile.countDocuments(filter);
    const volunteers = await UserProfile.find(filter)
      .skip((page-1) * pageSize)
      .limit(parseInt(pageSize))
      .populate("assignedEvents completedEvents");
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

const getVolunteersByEvent = async (req, res) => {
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    const volunteers = await UserProfile.find({
      $or: [
        { assignedEvents: eventId },
        { completedEvents: eventId }
      ]
    });

    if (!volunteers.length) {
      return res.status(404).json({ message: 'No volunteers found for this event' });
    }
    res.json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  getVolunteers,
  removeVolunteer,
  getVolunteersByEvent,
};
