import React from 'react';
import Header from '../components/Header';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
    const { loginWithRedirect } = useAuth0();

    const handleLogin = () => {
        loginWithRedirect();
    };

    return (
        <>      
            <div className="container">
                <Header />
                <div className="login">
                    <h2>Login</h2>
                    <p style={{ marginTop: '1rem' }}>Please login to use the platform</p>
                    <button 
                        className='loginbutton' 
                        type="button" 
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                    <div className="register-link">
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </div>
                </div>
            </div>        
        </>
    );
};

export default Login;
