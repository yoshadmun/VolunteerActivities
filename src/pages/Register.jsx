import React, { useState } from 'react';
import Header from '../components/Header';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const Register = () => {
    const {loginWithRedirect} = useAuth0();
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [fullname, setFullname] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await loginWithRedirect({
                screen_hint: 'signup',
                email,
                password,
                app_metadata: {fullname},
            });
        } catch (error){
            console.log('Error during signup: ', error)
        }
    };

    return (
        <>
            <div className="container">
                {/* Login Form */}
            <Header/>
                {/* Register Form */}
                <div className="register">
                    <form onSubmit={handleSubmit}>
                        <h2>Registration</h2>
                        <p>Please provide the following to verify your identity</p>

                        <div className="input-box">
                            <span className="icon"><i className='bx bx-user'></i></span>
                            <input 
                                type="text" 
                                required 
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                            <label>Full Name</label>
                        </div>

                        <div className="input-box">
                            <span className="icon"><i className='bx bx-envelope'></i></span>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Email</label>
                        </div>

                        <div className="input-box">
                            <span className="icon"><i className='bx bxs-lock-alt'></i></span>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                            <label>Password</label>
                        </div>

                        <button className='loginbutton' type="submit">Register</button>
                        <div className="login-link">
                            <p>Already have an account? <a href="#">Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
