import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import PollsList from './components/PollsList';
import CreatePoll from './components/CreatePoll';
import PollDetail from './components/PollDetail';

/**
 * Root component that manages routing and global user state.
 */
function App() {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token && username ? { token, username } : null;
  });

  /**
   * Handle successful login by storing token and username in localStorage
   * and updating local state.
   * @param {string} token
   * @param {string} username
   */
  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({ token, username });
  };

  /**
   * Log the user out by clearing localStorage and resetting state.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" replace />}
          />
          <Route
            path="/create"
            element={user ? <CreatePoll /> : <Navigate to="/login" replace />}
          />
          <Route path="/polls/:id" element={<PollDetail user={user} />} />
          <Route path="/" element={<PollsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;