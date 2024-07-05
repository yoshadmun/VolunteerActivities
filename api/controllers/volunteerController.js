const volunteers = require('../data/volunteers');

const getVolunteers = (req,res) => {
    res.json(volunteers);
};

module.exports = {
    getVolunteers,
};