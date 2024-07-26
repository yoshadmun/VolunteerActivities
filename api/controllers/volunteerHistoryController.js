const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');

const getVolunteerHistory = async (req,res) => {
  const {volunteerId} = req.params;
  try {
    const volunteer = await UserProfile.findOne({userId: volunteerId});
    if(!volunteer){
      return res.status(404).json({message: 'Volunteer not found'});
    }
    const completedEvents = await Event.find({
      _id: {$in: volunteer.completedEvents}
    });

    const eventDetails = completedEvents.map(event => ({
      eventName: event.eventName,
      location: event.location,
      date: event.date,
      status: 'Completed'
    }));

    res.json(eventDetails);
  } catch (error) {
    console.error('Error fetching volunteer history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getVolunteerHistory };
