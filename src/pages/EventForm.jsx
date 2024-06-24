import React, {useState} from 'react';
import Select from 'react-select'

function EventForm() {
    const [eventData,setEvenData] = useState({
        eventName:'',
        eventDescription:'',
        streetAddress:'',
        city:'',
        state:'',
        zipcode:'',
        requiredSkills:[],
        urgency:'',
        eventDate:''
    });

    //const skillsOptions = ['Leadership','Cultural Awareness','Adaptability','Teamwork','Communication'];
    const options = [
        {value:'css', label: 'CSS'},
        {value:'html', label: 'HTML'},
        {value:'c++', label:'C++'}
    ];
    const urgencyOptions = [
        {value:'low',label:'Low'},
        {value:'medium',label:'Medium'},
        {value:'high',label:'High'}
    ];
    const states = [
        'AL',
        'AK',
        'AS',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'DC',
        'FM',
        'FL',
        'GA',
        'GU',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MH',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'MP',
        'OH',
        'OK',
        'OR',
        'PW',
        'PA',
        'PR',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VI',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
      ];

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEvenData({
            ...eventData,
            [name]: value
        });
    };

   // const handleMultiSelectChange = (e) => {
   //     const value = Array.from(e.target.selectedOptions, (option)=>option.value);
   //     setEvenData({
   //         ...eventData,
   //         requiredSkills: value
   //     });
   // };

    const handleSkillsChange = (selectedOptions)=>{
        setEvenData({
            ...eventData,
            requiredSkills: selectedOptions
        })
    };
    const handleUrgencyChange = (selectedUrgency)=>{
        setEvenData({
            ...eventData,
            urgency: selectedUrgency
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Event Data', eventData)
    };

    return(
        <>
            <div className='container'>
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
                style={{height:'8rem'}}
            />
            <input
                className='eventForm'
                placeholder='Street Address'
                type='text'
                name='streetAddress'
                value={eventData.streetAddress}
                onChange={handleInputChange}
                maxLength={50}
                required
            />
            <input
                className='eventForm'
                placeholder='City'
                type='text'
                name='city'
                value={eventData.city}
                onChange={handleInputChange}
                maxLength={30}
                required
            />
            <select
                className='eventForm'
                name='state'
                value={eventData.state}
                onChange={handleInputChange}
                required
            >
                <option value=''>Select a state</option>
                {states.map(state=>(
                    <option key={state} value={state}>{state}
                </option>))}
            </select>
            <input
                className='eventForm'
                placeholder='Zip Code'
                type='text'
                name='zipcode'
                value={eventData.zipcode}
                onChange={handleInputChange}
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
        </form>
            </div>
        </>
    )
}

export default EventForm