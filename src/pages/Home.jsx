import React, { useState } from 'react';
import { useFormik } from 'formik';

function RegistrationForm() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const formik = useFormik({
        initialValues: {
            fName: '',
            lName: '',
            email: '',
            streetAddress: '',
            city: '',
            state: '',
            zipcode: '',
            phoneNumber: '',
            password: ''
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        }
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
            <h1>Register</h1>
            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px' }}>
                <input type="text" placeholder="First name" name="fName" onChange={formik.handleChange} value={formik.values.fName} required />
                <input type="text" placeholder="Last name" name="lName" onChange={formik.handleChange} value={formik.values.lName} required />
                <input type="email" placeholder="Email" name="email" onChange={formik.handleChange} value={formik.values.email} required />
                <input type="text" placeholder="Street address" name="streetAddress" onChange={formik.handleChange} value={formik.values.streetAddress} required />
                <input type="text" placeholder="City" name="city" onChange={formik.handleChange} value={formik.values.city} required />
                <input type="text" placeholder="State" name="state" onChange={formik.handleChange} value={formik.values.state} required />
                <input type="text" placeholder="Zipcode" name="zipcode" onChange={formik.handleChange} value={formik.values.zipcode} required />
                <input type="tel" placeholder="Phone number" name="phoneNumber" onChange={formik.handleChange} value={formik.values.phoneNumber} required />
                <input type={isPasswordVisible ? 'text' : 'password'} placeholder="Password" name="password" onChange={formik.handleChange} value={formik.values.password} required />
                <button type="button" onClick={togglePasswordVisibility}>{isPasswordVisible ? 'Hide Password' : 'Show Password'}</button>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default RegistrationForm;
