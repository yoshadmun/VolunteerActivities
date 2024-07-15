const volunteers = require('../data/volunteers');

const getAssignedEvents = (req, res) => {
  const { volunteerId } = req.params;
  const volunteer = volunteers.find(v => v.userId.toString() === volunteerId);
  if (volunteer) {
    res.json(volunteer.assignedEvents || []);
  } else {
    res.status(404).json({ message: 'Volunteer not found' });
  }
};

module.exports = { getAssignedEvents };
