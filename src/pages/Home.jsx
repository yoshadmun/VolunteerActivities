import Header from "../components/Header";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <div className="container">
                <Header/>
                <div className="homepage1">
                    <h1 className="headerHomepage1">Let's help the world gets better. Be a volunteer with us!</h1>
                    <div className="homepage2">
                        <button className="button">
                            <Link to="/login">Login</Link>
                        </button>
                        <button className="button">
                            <Link to="/register">Register</Link>
                        </button>
                        <button className="button">
                            <Link to="/admindashboard">Admin</Link>
                        </button>
                    </div>
                </div>
                <div className="homepage3">
                    <div className="homepage4">
                        <img src="/assets/hands.svg" alt="hands image" style={{height:'13rem',marginTop:'1rem'}}/>
                        <ul className="card">
                            <li>Make a positive difference in the world</li>
                            <li>Connect with people who share your passions and interests</li>
                            <li>Build skills and experience that can enhance yourself</li>
                        </ul>
                    </div>
                    <div className="homepage4">
                        <img src="/assets/eco.svg" style={{height:'13rem',marginTop:'1rem'}}/>
                        <ul className="card">
                            <li>Protect and conserve the environment</li>
                            <li>Provide comfort and support to all people</li>
                            <li>Make dreams come true</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;