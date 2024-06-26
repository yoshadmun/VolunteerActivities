import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
    <div className='headerpage1'>
        <div style={{paddingLeft:'2.5rem', paddingTop:'1.25rem',fontSize:'2rem',fontFamily:'fantasy'}}>
          Volunteer Nexus
        </div>

        <div className='headerpage2'>
          <ul className='headerUl1'>
            <li className='headerLi'>
              <Link to='/'>Home</Link>
            </li>
            <li className='headerLi'>
              <Link to='/eventform'>Event Form</Link>
            </li>
            <li className='headerLi'>
              <Link to='/matching'>Matching</Link>
            </li>
            <li className='headerLi'>
              <button style={{backgroundColor:'transparent'}}>
                <Link to='/'>Login</Link>
              </button>
            </li>
            <li className='headerLi'>
              <button style={{backgroundColor:'#5d5fc0'}}>
                <Link to='/'>Register</Link>
              </button>
            </li>
          </ul>
        </div>
    </div>
    </>
  );
}

export default Header;
