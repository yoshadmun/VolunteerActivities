import React from 'react';
import Header from '../components/Header';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
    const {loginWithRedirect} = useAuth0();
    const handleLogin = () => {
        loginWithRedirect();
    };
    return (
        <>      
            <div className="container">
            <Header/>
                {/* Login Form */}
                <div className="login">
                    <form action="#">
                        <h2>Login</h2>
                        <p style={{marginTop:'1rem'}}>Please login to use the platform</p>

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
                            <label><input type="checkbox" style={{marginRight:'5px'}} />Remember me</label>
                            <a href="#">Forgot password?</a>
                        </div>

                        <button 
                            className='loginbutton' 
                            type="button" 
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <div className="register-link">
                            <p>Don't have an account? <a href="#">Register</a></p>
                        </div>
                    </form>
                </div>
            </div>        
        </>
    );
};

export default Login;
