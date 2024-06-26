import React from 'react';
import '../matinstyle.css';

const Login = () => {
    return (
        <section>
            <div className="container">
                {/* Login Form */}
                <div className="login-box">
                    <form action="#">
                        <h2>Login</h2>
                        <p>Please login to use the platform</p>

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

                        <div className="remember-forgot">
                            <label><input type="checkbox" />Remember me</label>
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type="submit">Login</button>
                        <div className="register-link">
                            <p>Don't have an account? <a href="#">Register</a></p>
                        </div>
                    </form>
                </div>

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

                        <button type="submit">Register</button>
                        <div className="login-link">
                            <p>Already have an account? <a href="#">Login</a></p>
                        </div>
                    </form>
                </div>

                {/* Profile Form */}
                <div className="profile-form">
                    <h2>Complete Your Profile</h2>
                    <form action="#">
                        <div className="form-container">
                            <div className="form-column">
                                <div className="input-box">
                                    <input type="text" required maxLength="50" />
                                    <label>Full Name</label>
                                </div>
                                <div className="input-box">
                                    <input type="text" required maxLength="100" />
                                    <label>Address 1</label>
                                </div>
                                <div className="input-box-optional">
                                    <input type="text" required maxLength="100" />
                                    <label>Address 2</label>
                                </div>
                                <div className="input-box">
                                    <input type="text" required maxLength="100" />
                                    <label>City</label>
                                </div>
                                <div className="input-box">
                                    <select required>
                                        <option value="" disabled selected></option>
                                        <option value="CA">California</option>
                                        <option value="TX">Texas</option>
                                    </select>
                                    <label>State</label>
                                </div>
                            </div>
                            <div className="form-column">
                                <div className="input-box">
                                    <input type="text" required pattern="\d{5}(-\d{4})?" maxLength="9" />
                                    <label>Zip Code</label>
                                </div>
                                <div className="input-box">
                                    <select multiple required>
                                        <option value="skill1">Skill1</option>
                                        <option value="skill2">Skill2</option>
                                        <option value="skill3">Skill3</option>
                                    </select>
                                    <label>Skills</label>
                                </div>
                                <div className="input-box-optional">
                                    <textarea maxLength="255"></textarea>
                                    <label>Preferences</label>
                                </div>
                                <div className="input-box">
                                    <input type='date' required />
                                    <label>Availability</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit">Save Profile</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
