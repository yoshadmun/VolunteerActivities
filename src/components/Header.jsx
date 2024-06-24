import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="header">
      <h1 style={{ display: "flex", marginLeft: "2.5rem", alignItems: "center" }}>Volunteer Application</h1>
      <div className="nav">
        <ul className="ul">
          <li className="headerLi"><Link className="a" to="/eventform">Event Form</Link></li>
          <li className="headerLi"><Link className="a" to="/matching">Matching</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
