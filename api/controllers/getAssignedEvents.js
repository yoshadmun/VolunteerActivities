const volunteers = require('../data/volunteers');
const UserProfile = require('../models/UserProfileModel');

/*const getAssignedEvents = (req, res) => {
  const { volunteerId } = req.params;
  const volunteer = volunteers.find(v => v.userId.toString() === volunteerId);
  if (volunteer) {
    res.json(volunteer.assignedEvents || []);
  } else {
    res.status(404).json({ message: 'Volunteer not found' });
  }
};*/

const getAssignedEvents = async (req,res) => {
  const {volunteerId} = req.params;
  try {
    const volunteer = await UserProfile.findOne({userId: volunteerId});
    if(!volunteer){
      return res.status(404).json({message:'Volunteer not found'});
    }
    res.json(volunteer.assignedEvents || []);
  } catch (e) {
    console.error('Error fetching assigned events:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAssignedEvents };
