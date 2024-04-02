import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register from './register';
import Login from './login';
import Dashboard from './dashboard';
import Devotee from './devotees';
import Courses from './courses';
import Donation from './donation';
import DevoteeTile from './devoteeTile';
import Profile from './profile';
import './App.css';
import Profile1 from './profile1';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on page load
    const token = localStorage.getItem('token');
    if (token) {
      // Validate the token (e.g., check expiration)
      if (isTokenValid(token)) {
        setAuthenticated(true);
      } else {
        refreshAuthentication();
      }
    }
    setLoading(false);
  }, []);

  const isTokenValid = (token) => {
    // Implement your token validation logic here
    // For example, check if the token is expired
    // Return true if the token is valid, false otherwise
    return true; // Placeholder, implement your logic
  };

  const refreshAuthentication = () => {
    // Implement token refresh logic here
    // This function should refresh the token and update the authentication status
    // You can make an API call to refresh the token
    // If the token is successfully refreshed, setAuthenticated(true)
    // Otherwise, redirect the user to the login page
    // Example:
    // refreshToken().then((response) => {
    //   if (response.ok) {
    //     setAuthenticated(true);
    //   } else {
    //     // Handle token refresh failure
    //     // Redirect user to login page
    //   }
    // });
    // For now, we'll assume token refresh is successful
    setAuthenticated(true);
  };

  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BrowserRouter >
        <Routes>
          <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
          <Route
            path="/register"
            element={authenticated ? <Register /> : <Navigate to="/home" /> }
          />
          <Route
            path="/home"
            element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/devoteeTile"
            element={authenticated ? <DevoteeTile /> : <Navigate to="/login" />}
          />
          <Route
            path="/courses"
            element={authenticated ? <Courses /> : <Navigate to="/login" />}
          />
          <Route
            path="/devotees"
            element={authenticated ? <Devotee /> : <Navigate to="/login" />}
          />
          <Route
            path="/donation"
            element={authenticated ? <Donation /> : <Navigate to="/login" />}
          />
          <Route path="/devotee/:devoteeId" element={<Profile />} />
          <Route path="/course/:courseId" element={<Profile1 />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
