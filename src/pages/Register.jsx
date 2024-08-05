import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const { loginWithRedirect } = useAuth0();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [error, setError] = useState('');
    const handleLogin = () => {
        loginWithRedirect();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://${import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN}/dbconnections/signup`, {
                client_id: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID,
                email: email,
                password: password,
                connection: 'Username-Password-Authentication',
                user_metadata: { fullname }
            });

            if (response.data) {
                // Redirect to login after successful sign-up
                await loginWithRedirect();
            }
        } catch (error) {
            setError(error.response ? error.response.data.description : 'An error occurred during signup.');
            console.log('Error during signup: ', error);
        }
    };

    return (
        <>
            <div className="container">
                <Header />
                <div className="register">
                    <form onSubmit={handleSubmit}>
                        <h2 style={{color:'black'}}>Registration</h2>
                        <p style={{color:'black'}}>Please provide the following to verify your identity</p>

                        {error && <p className="error">{error}</p>}

                        <div className="input-box">
                            <span className="icon"><i className='bx bx-user'></i></span>
                            <input 
                                placeholder='Full Name'
                                type="text" 
                                required 
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                            
                        </div>

                        <div className="input-box">
                            <span className=""><i className='bx bx-envelope'></i></span>
                            <input 
                                placeholder='Email'
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            
                        </div>

                        <div className="input-box">
                            <span className="icon"><i className='bx bxs-lock-alt'></i></span>
                            <input
                                placeholder='Password'
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />                            
                        </div>

                        <button className='loginbutton' type="submit">Register</button>
                        <div className="login-link" onClick={handleLogin}>
                            <p style={{color:'black'}}>Already have an account?  
                                <Link className='link' style={{color:'black'}}> Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
