import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventForm from './pages/EventForm';
import Matching from './pages/Matching';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ViewVolunteerProfiles from './pages/Profile';
/*import Login from './pages/Login';*/
import Register from './pages/Register';
import VolunteerHistory from './pages/VolunteerHistory';
import Notifications from './pages/Notification';
import User from './pages/User';
import UserProfileForm from './pages/UserProfileForm';
import FindEventForUser from './pages/FindEventsForUser';
import { useAuth0 } from '@auth0/auth0-react';
import ViewEvents from './pages/ViewEvents';

function App() {
  const {isAuthenticated} = useAuth0();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/eventform" element={<EventForm />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/admindashboard" element={<AdminDashboard/>}/>
        <Route path="/profile" element={<ViewVolunteerProfiles/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/volunteerhistory' element={<VolunteerHistory/>}/>
        <Route path='/notification' element={<Notifications/>}/>
        <Route path='/user' element={<User/>}/>
        <Route path='userprofileform' element={<UserProfileForm/>}/>
        <Route path="/eventsforuser" element={<FindEventForUser/>}/>
        <Route path='/viewevents' element={<ViewEvents/>}/>
      </Routes>
    </Router>
  );
}

export default App;
