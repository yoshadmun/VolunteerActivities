const volunteers = require ('../data/volunteers');
const events = require ('../data/events');

const getMatchedEvents = (req,res) => {
    const {volunteerId} = req.params;
    const volunteer = volunteers.find(v=>v.id === volunteerId);

    if (!volunteer){
        return res.status(404).json({message:'Volunteer not found'});
    }

    const matchedEvents = events.filter(event=>{
        event.requirements.some(req=>volunteer.skills.includes(req))
    });

    res.json({'Here are the matched events ':matchedEvents});
};

const getMatchedVolunteers = (req,res)=>{
    const {eventId} = req.params;
    const event = events.find(e=>e.id === eventId);

    if(!event){
        return res.status(404).json({message:'Event not found'});
    }

    const matchedVolunteers = volunteers.filter(volunteer=>{
        volunteer.skills.some(skill=>event.requirements.includes(skill))
    });

    res.json({'Here are the matched volunteers: ': matchedVolunteers});
}

module.exports={
    getMatchedEvents,
    getMatchedVolunteers,
}