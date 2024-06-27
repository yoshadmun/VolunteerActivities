import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
    <div className='headerpage1'>
        <div style={{paddingLeft:'2rem', paddingTop:'1rem',fontSize:'3rem',fontFamily:'fantasy',overflowY:'hidden'}}>
          <Link style={{textDecoration:'none',color:'inherit'}}to='/'>Volunteer Nexus</Link>
        </div>

        <div className='headerpage2'>
          <ul className='headerUl1'>
            <li className='headerLi'>
            <button className='button'>
                <Link className='link'to='/'>Home</Link>
              </button>
            </li>
            <li className='headerLi'>
            <button className='button'>
                <Link className='link'to='/user'>User</Link>
              </button>
            </li>
            <li className='headerLi'>
            <button className='button'>
                <Link className='link'to='/admindashboard'>Admin</Link>
              </button>
            </li>
            <li className='headerLi'>
              <button className='button'>
                <Link className='link'to='/login'>Login</Link>
              </button>
            </li>
            <li className='headerLi'>
              <button className='button'>
                <Link className='link'to='/register'>Register</Link>
              </button>
            </li>
            <li className='headerLi'>
              <button className='button'>
                <Link className='link'to='/notification'>Notification</Link>
              </button>
            </li>
          </ul>
        </div>
    </div>
    </>
  );
}

export default Header;
