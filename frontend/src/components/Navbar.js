import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navigation bar displayed on all pages. Shows different links
 * depending on whether a user is logged in.
 *
 * @param {{ user: { username: string } | null, onLogout: Function }} props
 */
const Navbar = ({ user, onLogout }) => {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#343a40',
        color: '#fff',
      }}
    >
      <div>
        <Link to="/" style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Voting App
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/" style={{ color: '#fff' }}>
          Home
        </Link>
        {user ? (
          <>
            <Link to="/create" style={{ color: '#fff' }}>
              Create Poll
            </Link>
            <span style={{ color: '#adb5bd' }}>Hello, {user.username}</span>
            <button
              onClick={onLogout}
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: '#fff' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;