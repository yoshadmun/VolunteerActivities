const volunteers = [
    { id: 1, name: 'John Doe', skills: ['Leadership', 'Communication'] },
    { id: 2, name: 'Jane Smith', skills: ['Teamwork', 'Adaptability'] },
  ];
  
  const events = [
    { id: 1, name: 'Community Clean Up', requirements: ['Leadership'] },
    { id: 2, name: 'Food Drive', requirements: ['Teamwork'] },
    { id: 3, name: 'Workshop', requirements: ['Communication', 'Adaptability'] },
  ];
  
  export const fetchVolunteers = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(volunteers);
      }, 500);
    });
  };
  
  export const fetchEvents = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(events);
      }, 500);
    });
  };
  