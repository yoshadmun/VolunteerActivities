const volunteers = require('../data/volunteers'); // Assume this is an array of volunteer objects

const createUserProfile = (req, res) => {
  const { userId, profileData } = req.body;
  const existingVolunteerIndex = volunteers.findIndex(vol => vol.userId === userId);

  if (existingVolunteerIndex !== -1) {
      // Update existing profile
      volunteers[existingVolunteerIndex] = { ...volunteers[existingVolunteerIndex], ...profileData };
      res.status(200).json({'Updating profile ': volunteers[existingVolunteerIndex]});
  } else {
      // Create new profile
      const newVolunteer = { ...profileData, userId, id: volunteers.length + 1 };
      volunteers.push(newVolunteer);
      res.status(201).json({'Create profile ': newVolunteer});
  }
};

const getUserProfile = (req,res) =>{
  const{userId} = req.params;
  const profile = volunteers.find(v=>v.userId.toString() === userId);
  if(!profile){
    return res.status(404).json({'Profile not found':userId});
  } 
  res.json(profile);
};

module.exports={
    createUserProfile,
    getUserProfile,
};