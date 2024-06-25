// MockAPI.js

const volunteers = Array.from({ length: 200 }, (_, id) => ({
  id: id + 1,
  name: `Volunteer ${id + 1}`,
  skills: ['Leadership', 'Communication', 'Teamwork', 'Cultural Awareness', 'Adaptability'].sort(() => 0.5 - Math.random()).slice(0, 3),
}));

const events = Array.from({ length: 100 }, (_, id) => ({
  id: id + 1,
  name: `Event ${id + 1}`,
  requirements: ['Leadership', 'Communication', 'Teamwork', 'Cultural Awareness', 'Adaptability'].sort(() => 0.5 - Math.random()).slice(0, 3),
}));

export const fetchVolunteers = (search = '', page = 1, pageSize = 10) => {
  const filteredVolunteers = volunteers.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));
  const paginatedVolunteers = filteredVolunteers.slice((page - 1) * pageSize, page * pageSize);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: paginatedVolunteers,
        total: filteredVolunteers.length,
      });
    }, 500);
  });
};

export const fetchEvents = (search = '', page = 1, pageSize = 10) => {
  const filteredEvents = events.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  const paginatedEvents = filteredEvents.slice((page - 1) * pageSize, page * pageSize);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: paginatedEvents,
        total: filteredEvents.length,
      });
    }, 500);
  });
};
