import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import EventForm from './pages/EventForm';
import Matching from './pages/Matching';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
       
        <Route path="/eventform" element={<EventForm />} />
        <Route path="/matching" element={<Matching />} />
      </Routes>
    </Router>
  );
}

export default App;
