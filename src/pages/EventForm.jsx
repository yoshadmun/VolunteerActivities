import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../components/Header';
import axios from 'axios';

function EventForm() {
  const [eventData, setEventData] = useState({
    eventName: '',
    eventDescription: '',
    location: {
      streetAddress: '',
      city: '',
      state: '',
      zipcode: '',
    },
    requiredSkills: [],
    urgency: '',
    eventDate: ''
  });

  const handleReset = () => {
    setEventData({
      eventName: '',
      eventDescription: '',
      location: {
        streetAddress: '',
        city: '',
        state: '',
        zipcode: '',
      },
      requiredSkills: [],
      urgency: '',
      eventDate: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      eventName: eventData.eventName,
      eventDescription: eventData.eventDescription,
      location: {
        streetAddress: eventData.location.streetAddress,
        city: eventData.location.city,
        state: eventData.location.state,
        zipCode: eventData.location.zipcode,
      },
      requiredSkills: eventData.requiredSkills.map(skill => skill.value),
      urgency: eventData.urgency.value,
      date: eventData.eventDate.toISOString().split('T')[0], // Extract only the date part
      assignedVolunteers: [],
      active: true,
    };
    console.log('Sending event data: ', formattedData)
    axios.post('http://localhost:3001/api/events', formattedData)
    .then(response => {
      console.log('Event created: ', response.data);
      handleReset();
    })
    .catch(error=>{
      console.error('There was an error creating the event!', error);
    });
  };

  const options = [
    { value: 'Cleaning', label: 'Cleaning' },
    { value: 'Organizing', label: 'Organizing' },
    { value: 'Teamwork', label: 'Teamwork' },
    { value: 'Food Preparation', label: 'Food Preparation' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Tech Support', label: 'Tech Support' },
    { value: 'Patience', label: 'Patience' },
    { value: 'Teaching', label: 'Teaching' },
    { value: 'Public Speaking', label: 'Public Speaking' },
    { value: 'Research', label: 'Research' },
    { value: 'Environmental Knowledge', label: 'Environmental Knowledge' },
    { value: 'Sports Coaching', label: 'Sports Coaching' },
    { value: 'Event Coordination', label: 'Event Coordination' },
    { value: 'Team Leadership', label: 'Team Leadership' },
    { value: 'Art Instruction', label: 'Art Instruction' },
    { value: 'Creativity', label: 'Creativity' },
    { value: 'Childcare', label: 'Childcare' },
    { value: 'Medical Assistance', label: 'Medical Assistance' },
    { value: 'Health Education', label: 'Health Education' },
    { value: 'First Aid', label: 'First Aid' },
    { value: 'STEM Teaching', label: 'STEM Teaching' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Event Planning', label: 'Event Planning' },
    { value: 'Animal Care', label: 'Animal Care' },
    { value: 'Fundraising', label: 'Fundraising' },
    { value: 'Counseling', label: 'Counseling' },
    { value: 'Empathy', label: 'Empathy' }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const states = [
    'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL',
    'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH',
    'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
    'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value
    });
  };

  const handleLocationChange = (e) => {
    const {name, value} = e.target;
    setEventData({
      ...eventData,
      location: {
        ...eventData.location,
        [name]: value
      }
    });
  }

  const handleSkillsChange = (selectedOptions) => {
    setEventData({
      ...eventData,
      requiredSkills: selectedOptions
    });
  };

  const handleUrgencyChange = (selectedUrgency) => {
    setEventData({
      ...eventData,
      urgency: selectedUrgency
    });
  };

  const handleDateChange = (date) => {
    setEventData({
      ...eventData,
      eventDate: date
    });
  };

  return (
    <>
      <div className='container'>
        <Header />
        <form onSubmit={handleSubmit} className='form'>
          <h1>Event Management Form</h1>
          <input
            className='eventForm'
            placeholder='Event Name'
            type='text'
            name='eventName'
            value={eventData.eventName}
            onChange={handleInputChange}
            maxLength='30'
            required
          />
          <textarea
            className='eventForm'
            placeholder='Event Description'
            name='eventDescription'
            value={eventData.eventDescription}
            onChange={handleInputChange}
            maxLength={500}
            required
            style={{ height: '8rem' }}
          />
          <input
            className='eventForm'
            placeholder='Street Address'
            type='text'
            name='streetAddress'
            value={eventData.location.streetAddress}
            onChange={handleLocationChange}
            maxLength={50}
            required
          />
          <input
            className='eventForm'
            placeholder='City'
            type='text'
            name='city'
            value={eventData.location.city}
            onChange={handleLocationChange}
            maxLength={30}
            required
          />
          <select
            className='eventForm'
            name='state'
            value={eventData.location.state}
            onChange={handleLocationChange}
            required
          >
            <option value=''>Select a state</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <input
            className='eventForm'
            placeholder='Zip Code'
            type='text'
            name='zipcode'
            value={eventData.location.zipcode}
            onChange={handleLocationChange}
            maxLength={5}
            required
          />
          <Select
            className='eventForm'
            placeholder='Required Skills'
            name='requiredSkills'
            value={eventData.requiredSkills}
            onChange={handleSkillsChange}
            isMulti
            options={options}
            required
          />
          <Select
            className='eventForm'
            placeholder='Urgency'
            name='urgency'
            value={eventData.urgency}
            onChange={handleUrgencyChange}
            options={urgencyOptions}
            required
          />
          <DatePicker
            selected={eventData.eventDate}
            onChange={handleDateChange}
            placeholderText='Select Event Date'
            required
            wrapperClassName='eventForm'
            className='datepicker'
          />
          <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-evenly', gap: '100px' }}>
            <button className="button" type="button" onClick={handleReset}>
              Reset
            </button>
            <button className="button" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EventForm;
