// controllers/volunteerHistoryController.js

const volunteerHistory = require('../data/volunteerHistory');

const getVolunteerHistory = (req, res) => {
  const {volunteerId} = req.params;
  const history = volunteerHistory.find(vh=>vh.volunteerId === volunteerId);
  if(!history) {
    return res.status(404).json({message:'No history found for this volunteer'});
  }
  res.json(history.events);
}

module.exports = {
  getVolunteerHistory,
}








/*exports.getVolunteerHistory = (req, res) => {
  const volunteerId = parseInt(req.params.volunteerId);
  const history = volunteerHistory.filter(entry => entry.volunteerId === volunteerId);
  res.json(history);
};

exports.addVolunteerHistory = (req, res) => {
  const { volunteerId, eventId, participationDate } = req.body;
  const historyEntry = {
    id: volunteerHistory.length + 1,
    volunteerId,
    eventId,
    participationDate
  };
  volunteerHistory.push(historyEntry);
  console.log('Volunteer history added:', historyEntry);
  res.status(201).json(historyEntry);
};

exports.updateVolunteerHistory = (req, res) => {
  const { id } = req.params;
  const { volunteerId, eventId, participationDate } = req.body;
  const historyEntry = volunteerHistory.find(entry => entry.id === parseInt(id));
  if (historyEntry) {
    historyEntry.volunteerId = volunteerId || historyEntry.volunteerId;
    historyEntry.eventId = eventId || historyEntry.eventId;
    historyEntry.participationDate = participationDate || historyEntry.participationDate;
    res.json({ message: 'Volunteer history updated', historyEntry });
  } else {
    res.status(404).json({ error: 'History entry not found' });
  }
};*/


