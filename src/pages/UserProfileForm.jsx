import React, { useState } from 'react';
import styles from '../UserProfileForm.module.css'; // Import the CSS module
import Header from '../components/Header';
import Select from 'react-select';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const UserProfileForm = () => {
  const {user} = useAuth0();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    location:{
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
    },
    skills: [],
    preferences: '',
    availability: '',
  });

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === 'select-multiple') {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData({ ...formData, skills: selectedOptions });
  };

  const handleLocationChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [name]: value
      }
    });
  }

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

  const states = [
    'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL',
    'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH',
    'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
    'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleReset = () => {
    setFormData({
      fullName: '',
      location:{
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
      },
      skills: [],
      preferences: '',
      availability: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      userId: user.sub,
      profileData:{
        fullName: formData.fullName,
        location: {
          address1: formData.location.address1,
          city: formData.location.city,
          state: formData.location.state,
          zipCode: formData.location.zipCode,
        },
      skills: formData.skills.map(skill => skill.value),
      availability: formData.availability,
      active: true,
      }
    };
    console.log('Sending event data: ', formattedData)
    axios.post('http://localhost:3001/api/user-profile', formattedData)
    .then(response => {
      console.log('Profile created: ', response.data);
      handleReset();
      navigate('/user');
    })
    .catch(error=>{
      console.error('There was an error creating the profile!', error);
    });
  };


  return (
    <div className='container'>
        <Header/>
    <div className={styles.container}>
      <h1>User Profile Form</h1>
      <form id="user-profile-form" onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label htmlFor="full-name">Full Name</label>
          <input
            type="text"
            id="full-name"
            name="fullName"
            maxLength="50"
            required
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="address1">Address 1</label>
          <input
            type="text"
            id="address1"
            name="address1"
            maxLength="100"
            required
            value={formData.location.address1}
            onChange={handleLocationChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="address2">Address 2</label>
          <input
            type="text"
            id="address2"
            name="address2"
            maxLength="100"
            value={formData.location.address2}
            onChange={handleLocationChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            maxLength="100"
            required
            value={formData.location.city}
            onChange={handleLocationChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="state">State</label>
          <select
            name='state'
            id='state'
            value={formData.location.state}
            onChange={handleLocationChange}
            required
          >
            <option value=''>Select a state</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="zip-code">Zip Code</label>
          <input
            type="text"
            id="zip-code"
            name="zipCode"
            maxLength="5"
            pattern="[0-9]{5}"
            required
            value={formData.location.zipCode}
            onChange={handleLocationChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="skills">Skills</label>
          <Select
            className=''
            name='skills'
            value={formData.skills}
            onChange={handleSelectChange}
            isMulti
            options={options}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="preferences">Preferences</label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="availability">Availability</label>
          <input
            type="date"
            id="availability"
            name="availability"
            required
            value={formData.availability}
            onChange={handleChange}
          />
        </div>
        <div style={{display:'flex',justifyContent:'center', alignItems:'center'}}>
        <button type="submit" className='button'>Submit</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default UserProfileForm;
