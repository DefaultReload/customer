import React, { useEffect, useState } from 'react';
import Navbar from './Account';
import AccountInfo from './Profile';
import Security from './BookingNumbers';
import Orders from './OrderNumbers';
import CustomerRequest from './CustomerRequestForm';
import Logout from './logout';

import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [loading, setLoading] = useState(true); // Add a loading state to wait for auth check
  const navigate = useNavigate();
  const auth = getAuth(); // Get Firebase auth instance

  useEffect(() => {
    // Check user authentication status when app loads
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is not logged in
      }
      setLoading(false); // Stop loading when the auth check is complete
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [auth]);

  // If loading, you can return a loading screen or spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="app-container">
        {/* Only show Navbar if the user is authenticated */}
        {isAuthenticated && <Navbar />}
        <div className="main-container">
          <Routes>
            {/* Login is the default (index) route */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/Profile" /> : <AccountInfo />} />
            
            {/* Protect these routes - only accessible if logged in */}
            <Route path="/AccountInfo" element={isAuthenticated ? <AccountInfo /> : <Navigate to="/" />} />
            <Route path="/Security" element={isAuthenticated ? <Security /> : <Navigate to="/AccountInfo" />} />
            <Route path="/Orders" element={isAuthenticated ? <Orders /> : <Navigate to="/AccountInfo" />} />
            <Route path="/CustomerRequest" element={isAuthenticated ? <CustomerRequest /> : <Navigate to="/AccountInfo" />} />

            <Route path="/LogOut" element={isAuthenticated ? <Logout /> : <Navigate to="/" />} />
        

          </Routes>
        </div>
      </div>
    </>
  );
}
