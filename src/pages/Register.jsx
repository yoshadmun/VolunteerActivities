import React from 'react';
import Header from '../components/Header';
const Register = () => {
    return (
        <>
            <div className="container">
                {/* Login Form */}
            <Header/>
                {/* Register Form */}
                <div className="register">
                    <form action="#">
                        <h2>Registration</h2>
                        <p>Please provide the following to verify your identity</p>

                        <div className="input-box">
                            <span className="icon"><i className='bx bx-user'></i></span>
                            <input type="text" required />
                            <label>Full Name</label>
                        </div>

                        <div className="input-box">
                            <span className="icon"><i className='bx bx-envelope'></i></span>
                            <input type="email" required />
                            <label>Email</label>
                        </div>

                        <div className="input-box">
                            <span className="icon"><i className='bx bxs-lock-alt'></i></span>
                            <input type="password" required />
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
