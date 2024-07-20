const events = [
  {
    id: 1,
    eventName: 'Community Cleanup Drive',
    requiredSkills: ['Cleaning', 'Organizing', 'Teamwork'],
    location: {
      streetAddress: '123 Main Street',
      city: 'Cityville',
      state: 'CA',
      zipCode: '90001'
    },
    date: '2024-07-20',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 2,
    eventName: 'Food Drive for Homeless Shelter',
    requiredSkills: ['Food Preparation', 'Logistics', 'Communication'],
    location: {
      streetAddress: '456 Elm Avenue',
      city: 'Smalltown',
      state: 'NY',
      zipCode: '12345'
    },
    date: '2024-08-20',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 3,
    eventName: 'Tech Workshop for Seniors',
    requiredSkills: ['Tech Support', 'Patience', 'Teaching'],
    location: {
      streetAddress: '789 Oak Street',
      city: 'Sunnydale',
      state: 'TX',
      zipCode: '54321'
    },
    date: '2024-08-25',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 4,
    eventName: 'Environmental Awareness Campaign',
    requiredSkills: ['Public Speaking', 'Research', 'Environmental Knowledge'],
    location: {
      streetAddress: '210 Pine Road',
      city: 'Hilltop',
      state: 'CO',
      zipCode: '45678'
    },
    date: '2024-09-05',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 5,
    eventName: 'Youth Sports Tournament',
    requiredSkills: ['Sports Coaching', 'Event Coordination', 'Team Leadership'],
    location: {
      streetAddress: '987 Maple Lane',
      city: 'Riverside',
      state: 'WA',
      zipCode: '98765'
    },
    date: '2024-09-10',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 6,
    eventName: 'Art Workshop for Kids',
    requiredSkills: ['Art Instruction', 'Creativity', 'Childcare'],
    location: {
      streetAddress: '654 Cedar Avenue',
      city: 'Lakeside',
      state: 'AZ',
      zipCode: '34567'
    },
    date: '2024-09-15',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 7,
    eventName: 'Community Health Fair',
    requiredSkills: ['Medical Assistance', 'Health Education', 'First Aid'],
    location: {
      streetAddress: '876 Birch Street',
      city: 'Woodland Hills',
      state: 'OR',
      zipCode: '89012'
    },
    date: '2024-07-19',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 8,
    eventName: 'STEM Education Day',
    requiredSkills: ['STEM Teaching', 'Technology', 'Engineering'],
    location: {
      streetAddress: '543 Oakwood Drive',
      city: 'Springdale',
      state: 'PA',
      zipCode: '56789'
    },
    date: '2024-09-25',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 9,
    eventName: 'Animal Shelter Fundraiser',
    requiredSkills: ['Event Planning', 'Animal Care', 'Fundraising'],
    location: {
      streetAddress: '321 Pinecrest Avenue',
      city: 'Oceanview',
      state: 'GA',
      zipCode: '12345'
    },
    date: '2024-10-05',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 10,
    eventName: 'Elderly Care Support Group',
    requiredSkills: ['Counseling', 'Empathy', 'Support Group Facilitation'],
    location: {
      streetAddress: '890 Cedar Lane',
      city: 'Rivertown',
      state: 'MN',
      zipCode: '78901'
    },
    date: '2024-10-10',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 11,
    eventName: 'Community Library Renovation',
    requiredSkills: ['Construction', 'Project Management', 'Volunteer Coordination'],
    location: {
      streetAddress: '456 Elm Street',
      city: 'Smalltown',
      state: 'NY',
      zipCode: '12345'
    },
    date: '2024-10-15',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 12,
    eventName: 'Health and Fitness Expo',
    requiredSkills: ['Fitness Training', 'Nutrition', 'Event Management'],
    location: {
      streetAddress: '789 Oak Avenue',
      city: 'Sunnydale',
      state: 'TX',
      zipCode: '54321'
    },
    date: '2024-10-20',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 13,
    eventName: 'Community Garden Planting Day',
    requiredSkills: ['Gardening', 'Environmental Awareness', 'Community Engagement'],
    location: {
      streetAddress: '210 Pine Road',
      city: 'Hilltop',
      state: 'CO',
      zipCode: '45678'
    },
    date: '2024-10-25',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 14,
    eventName: 'Education Fair for Underprivileged Students',
    requiredSkills: ['Education Outreach', 'Student Counseling', 'Resource Allocation'],
    location: {
      streetAddress: '987 Maple Lane',
      city: 'Riverside',
      state: 'WA',
      zipCode: '98765'
    },
    date: '2024-11-05',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 15,
    eventName: 'Community Theater Performance',
    requiredSkills: ['Acting', 'Stage Management', 'Costume Design'],
    location: {
      streetAddress: '654 Cedar Avenue',
      city: 'Lakeside',
      state: 'AZ',
      zipCode: '34567'
    },
    date: '2024-11-10',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 16,
    eventName: 'Annual Charity Gala',
    requiredSkills: ['Event Planning', 'Fundraising', 'Public Relations'],
    location: {
      streetAddress: '876 Birch Street',
      city: 'Woodland Hills',
      state: 'OR',
      zipCode: '89012'
    },
    date: '2024-11-15',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 17,
    eventName: 'Tech Conference for Startups',
    requiredSkills: ['Tech Innovation', 'Entrepreneurship', 'Networking'],
    location: {
      streetAddress: '543 Oakwood Drive',
      city: 'Springdale',
      state: 'PA',
      zipCode: '56789'
    },
    date: '2024-11-20',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 18,
    eventName: 'Community Christmas Market',
    requiredSkills: ['Vendor Management', 'Event Coordination', 'Holiday Spirit'],
    location: {
      streetAddress: '321 Pinecrest Avenue',
      city: 'Oceanview',
      state: 'GA',
      zipCode: '12345'
    },
    date: '2024-12-05',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 19,
    eventName: 'Environmental Cleanup Day',
    requiredSkills: ['Environmental Conservation', 'Recycling', 'Community Outreach'],
    location: {
      streetAddress: '890 Cedar Lane',
      city: 'Rivertown',
      state: 'MN',
      zipCode: '78901'
    },
    date: '2024-12-10',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 20,
    eventName: 'Annual Volunteer Appreciation Dinner',
    requiredSkills: ['Event Planning', 'Catering', 'Speech Writing'],
    location: {
      streetAddress: '456 Elm Street',
      city: 'Smalltown',
      state: 'NY',
      zipCode: '12345'
    },
    date: '2024-12-15',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 21,
    eventName: 'Children Art Festival',
    requiredSkills: ['Art Instruction', 'Event Coordination', 'Childcare'],
    location: {
      streetAddress: '123 Maple Lane',
      city: 'Riverside',
      state: 'WA',
      zipCode: '98765'
    },
    date: '2024-12-20',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 22,
    eventName: 'Community Marathon',
    requiredSkills: ['Sports Management', 'Logistics', 'Volunteer Coordination'],
    location: {
      streetAddress: '789 Oakwood Drive',
      city: 'Springdale',
      state: 'PA',
      zipCode: '56789'
    },
    date: '2025-01-05',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 23,
    eventName: 'Tech Workshop for Teens',
    requiredSkills: ['Tech Support', 'Youth Education', 'Programming'],
    location: {
      streetAddress: '210 Pine Road',
      city: 'Hilltop',
      state: 'CO',
      zipCode: '45678'
    },
    date: '2025-01-10',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 24,
    eventName: 'Community Dance Performance',
    requiredSkills: ['Choreography', 'Dance Instruction', 'Event Management'],
    location: {
      streetAddress: '987 Cedar Avenue',
      city: 'Lakeside',
      state: 'AZ',
      zipCode: '34567'
    },
    date: '2025-01-15',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 25,
    eventName: 'Health and Wellness Fair',
    requiredSkills: ['Health Education', 'Nutrition Counseling', 'Medical Assistance'],
    location: {
      streetAddress: '876 Birch Street',
      city: 'Woodland Hills',
      state: 'OR',
      zipCode: '89012'
    },
    date: '2025-01-20',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 26,
    eventName: 'Community Book Drive',
    requiredSkills: ['Literacy Promotion', 'Book Sorting', 'Community Outreach'],
    location: {
      streetAddress: '543 Elm Avenue',
      city: 'Smalltown',
      state: 'NY',
      zipCode: '12345'
    },
    date: '2025-02-05',
    assignedVolunteers: [],
    active: true,
  },
  {
    id: 27,
    eventName: 'Environmental Seminar',
    requiredSkills: ['Environmental Awareness', 'Seminar Facilitation', 'Research'],
    location: {
      streetAddress: '321 Oak Street',
      city: 'Sunnydale',
      state: 'TX',
      zipCode: '54321'
    },
    date: '2025-02-10',
    assignedVolunteers: [],
    active: true,
  }
];

module.exports = events;