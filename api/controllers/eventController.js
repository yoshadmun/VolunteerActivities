const events = require('../data/events'); // Assume this is an array of event objects

const getEvents = (req, res) => {
  const { search = '', page = 1, pageSize = 10 } = req.query;
 
  // Filter events based on search term
  const filteredEvents = events.filter(e =>
    e.eventName.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate the filtered results
  const paginatedEvents = filteredEvents.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    events: paginatedEvents,
    total: filteredEvents.length,
  });
};

/*const getEvents = (req,res) => {
  res.json({events: events, total:events.length});
}*/

const createEvent = (req, res) => {
  const newEvent = { ...req.body, id: events.length + 1 };
  events.push(newEvent);
  res.status(201).json(newEvent);
};

module.exports = {
  getEvents,
  createEvent,
};
