const UserProfile = require('../models/UserProfileModel');

const createUserProfile = async (req, res) => {
  const { userId, profileData } = req.body;
  console.log(userId);
  try {
    let profile = await UserProfile.findOne({ userId });

    if (profile) {
      // Update existing profile without changing assignedEvents and completedEvents
      const { assignedEvents, completedEvents } = profile;
      Object.assign(profile, profileData);
      profile.assignedEvents = assignedEvents;
      profile.completedEvents = completedEvents;
      await profile.save();
      return res.status(200).json({ message: 'Profile updated', profileData });
    } else {
      // Create new profile with assignedEvents and completedEvents arrays
      profile = new UserProfile({ userId, ...profileData, assignedEvents: [], completedEvents: [] });
      await profile.save();
      return res.status(201).json({ message: 'Profile created', profileData });
    }
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserProfile = async (req,res) => {
  const {userId} = req.params;

  try{
    const profile = await UserProfile.findOne({userId});
    if(!profile) {
      return res.status(404).json({message:'Profile not found'});
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports={
    createUserProfile,
    getUserProfile,
};