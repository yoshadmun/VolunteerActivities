const events = require('../data/events');

const getEvents = (req,res) => {
    res.json(events);
};

const createEvent = (req,res) => {
    const newEvent = {...req.body, id: events.length +1};
    events.push(newEvent);
    res.status(201).json(newEvent);
};

module.exports = {
    getEvents,
    createEvent,
};