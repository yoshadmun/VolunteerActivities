// MockAPI.js

const volunteers = [
  { id: 1, name: 'Alice Smith', skills: ['Leadership', 'Communication','CSS'] },
  { id: 2, name: 'Bob Johnson', skills: ['Teamwork', 'Cultural Awareness'] },
  { id: 3, name: 'Charlie Brown', skills: ['Adaptability', 'Leadership'] },
  { id: 4, name: 'David Wilson', skills: ['Communication', 'Teamwork'] },
  { id: 5, name: 'Emma Davis', skills: ['Cultural Awareness', 'Adaptability'] },
  { id: 6, name: 'Fiona Garcia', skills: ['Leadership', 'Communication'] },
  { id: 7, name: 'George Martinez', skills: ['Teamwork', 'Cultural Awareness'] },
  { id: 8, name: 'Hannah Rodriguez', skills: ['Adaptability', 'Leadership'] },
  { id: 9, name: 'Isla Hernandez', skills: ['Communication', 'Teamwork'] },
  { id: 10, name: 'Jack Lee', skills: ['Cultural Awareness', 'Adaptability'] },
  { id: 11, name: 'Kara Clark', skills: ['Leadership', 'Communication'] },
  { id: 12, name: 'Liam Lewis', skills: ['Teamwork', 'Cultural Awareness'] },
  { id: 13, name: 'Mia Walker', skills: ['Adaptability', 'Leadership'] },
  { id: 14, name: 'Noah Hall', skills: ['Communication', 'Teamwork'] },
  { id: 15, name: 'Olivia Young', skills: ['Cultural Awareness', 'Adaptability'] },
  { id: 16, name: 'Paul Allen', skills: ['Leadership', 'Communication'] },
  { id: 17, name: 'Quinn Scott', skills: ['Teamwork', 'Cultural Awareness'] },
  { id: 18, name: 'Ruby King', skills: ['Adaptability', 'Leadership'] },
  { id: 19, name: 'Sam Wright', skills: ['Communication', 'Teamwork'] },
  { id: 20, name: 'Tina Baker', skills: ['Cultural Awareness', 'Adaptability'] },
];

const events = [
  { id: 1, name: 'Event 1', requirements: ['Leadership', 'Communication','CSS'] },
  { id: 2, name: 'Event 2', requirements: ['Teamwork', 'Cultural Awareness','CSS'] },
  { id: 3, name: 'Event 3', requirements: ['Adaptability', 'Leadership','CSS'] },
  { id: 4, name: 'Event 4', requirements: ['Communication', 'Teamwork','CSS'] },
  { id: 5, name: 'Event 5', requirements: ['Cultural Awareness', 'Adaptability','CSS'] },
  { id: 6, name: 'Event 6', requirements: ['Leadership', 'Communication','CSS'] },
  { id: 7, name: 'Event 7', requirements: ['Teamwork', 'Cultural Awareness','CSS'] },
  { id: 8, name: 'Event 8', requirements: ['Adaptability', 'Leadership','CSS'] },
  { id: 9, name: 'Event 9', requirements: ['Communication', 'Teamwork','CSS'] },
  { id: 10, name: 'Event 10', requirements: ['Cultural Awareness', 'Adaptability','CSS'] },
  { id: 11, name: 'Event 11', requirements: ['Leadership', 'Communication','CSS'] },
  { id: 12, name: 'Event 12', requirements: ['Teamwork', 'Cultural Awareness','CSS'] },
  { id: 13, name: 'Event 13', requirements: ['Adaptability', 'Leadership','CSS'] },
  { id: 14, name: 'Event 14', requirements: ['Communication', 'Teamwork','CSS'] },
  { id: 15, name: 'Event 15', requirements: ['Cultural Awareness', 'Adaptability','CSS'] },
  { id: 16, name: 'Event 16', requirements: ['Leadership', 'Communication','CSS'] },
  { id: 17, name: 'Event 17', requirements: ['Teamwork', 'Cultural Awareness'] },
  { id: 18, name: 'Event 18', requirements: ['Adaptability', 'Leadership'] },
  { id: 19, name: 'Event 19', requirements: ['Communication', 'Teamwork'] },
  { id: 20, name: 'Event 20', requirements: ['Cultural Awareness', 'Adaptability'] },
];

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

export const fetchMatchedEvents = (search = [], page = 1, pageSize = 10) => {
  const filteredEvents = events.filter(event =>
    search.some(searchTerm =>
      typeof searchTerm === 'string' && event.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
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
