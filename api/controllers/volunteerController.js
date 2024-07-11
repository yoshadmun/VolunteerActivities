const volunteers = require('../data/volunteers'); // Assume this is an array of volunteer objects

const getVolunteers = (req, res) => {
  const { search = '', page = 1, pageSize = 10 } = req.query;

  // Filter volunteers based on search term
  const filteredVolunteers = volunteers.filter(v =>
    v.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate the filtered results
  const paginatedVolunteers = filteredVolunteers.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    volunteers: paginatedVolunteers,
    total: filteredVolunteers.length,
  });
};


module.exports = {
  getVolunteers,
};
