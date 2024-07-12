const volunteers = require ('../data/volunteers')
const events = require ('../data/events')

const assignEventToVolunteer = (req,res) => {
    const {volunteerId, eventId} = req.body;

    const volunteer = volunteers.find(v=>v.id === volunteerId);
    const event = events.find(e=>e.id === eventId);

    if(!volunteer || !event){
        return res.status(404).json({message: `Volunteer or Event not found ${volunteerId} with ${eventId}`});
    }

    if(!event.assignedVolunteers.includes(volunteer.id)){
        event.assignedVolunteers.push(volunteer.id);
    } else{
        return res.status(404).json({message: 'Cannot assign volunteer to event'});
    }

    if(!volunteer.assignedEvents.includes(event.id)){
        volunteer.assignedEvents.push(event.id);
    } else{
        return res.status(404).json({message: 'Cannot assign event to volunteer'})
    }

    res.status(200).json({message: 'Event assigned to volunteer successfully'});
};

module.exports = {
    assignEventToVolunteer,
}