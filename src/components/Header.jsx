import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

function Header() {
  const { user, isAuthenticated, logout } = useAuth0();
  const namespace = 'http://localhost:5173/';
  const userRole = user && user[`${namespace}roles`];
  const isAdmin = userRole && userRole.includes('admin');
  const { loginWithRedirect } = useAuth0();

    const handleLogin = () => {
        loginWithRedirect();
    };
  return (
    <>
      <div className='headerpage1'>
        <div style={{ paddingLeft: '2rem', paddingTop: '1rem', fontSize: '3rem', fontFamily: 'fantasy', overflowY: 'hidden' }}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/'>Volunteer Nexus</Link>
        </div>

        <div className='headerpage2'>
          <ul className='headerUl1'>
            <li className='headerLi'>
              <button className='button'>
                <Link className='link' to='/'>Home</Link>
              </button>
            </li>
            {isAdmin && (
              <>
                <li className='headerLi'>
                  <button className='button'>
                    <Link className='link' to='/admindashboard'>Admin</Link>
                  </button>
                </li>
                <li className='headerLi'>
                  <button className='button' onClick={() => logout({returnTo: window.location.origin})}>
                    <Link className='link' to='/'>Log out</Link>
                  </button>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li className='headerLi'>
                  <button className='button' onClick={handleLogin} >
                    <Link className='link'>Login</Link>
                  </button>
                </li>
              </>
            )}
            {isAuthenticated && !isAdmin && (
              <>
                <li className='headerLi'>
                  <button className='button'>
                    <Link className='link' to='/eventsforuser'>Events</Link>
                  </button>
                </li>
                <li className='headerLi'>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className='dropdown-trigger'>
                      <HamburgerMenuIcon />
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content className='dropdown-content'>
                      <DropdownMenu.Item className='dropdown-item'>
                        <Link className='link' to="/user">Dashboard</Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className='dropdown-item'>
                        <Link className='link' to="/volunteerhistory">History</Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className='dropdown-item'>
                        <Link className='link' to="/notification">Notification</Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className='dropdown-item' onClick={() => logout({ returnTo: window.location.origin })}>
                        <Link className='link' to='/'>Logout</Link>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
