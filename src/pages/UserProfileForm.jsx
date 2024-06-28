import React, { useState } from 'react';
import styles from '../UserProfileForm.module.css'; // Import the CSS module
import Header from '../components/Header';

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
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
            value={formData.address1}
            onChange={handleChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="address2">Address 2</label>
          <input
            type="text"
            id="address2"
            name="address2"
            maxLength="100"
            value={formData.address2}
            onChange={handleChange}
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
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="state">State</label>
          <select
            id="state"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            {/* Add options for all states here */}
          </select>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="zip-code">Zip Code</label>
          <input
            type="text"
            id="zip-code"
            name="zipCode"
            maxLength="9"
            pattern="\d{5}(-\d{4})?"
            required
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="skills">Skills</label>
          <select
            id="skills"
            name="skills"
            multiple
            required
            value={formData.skills}
            onChange={handleChange}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            {/* Add options for all skills here */}
          </select>
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
