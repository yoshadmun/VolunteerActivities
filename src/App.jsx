import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventForm from './pages/EventForm';
import Matching from './pages/Matching';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ViewVolunteerProfiles from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerHistory from './pages/VolunteerHistory';
import Notifications from './pages/Notification';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/eventform" element={<EventForm />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/admindashboard" element={<AdminDashboard/>}/>
        <Route path="/profile" element={<ViewVolunteerProfiles/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/volunteerhistory' element={<VolunteerHistory/>}/>
        <Route path='/notification' element={<Notifications/>}/>
      </Routes>
    </Router>
  );
}

export default App;
