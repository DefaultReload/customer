import React, { useEffect, useState } from 'react';
//import Navbar from './AccountNav';
import AccountInfo from './AccountInfo'; // Import the new AccountInfo component
import Security from './Security'; // Import the new Security component
import Orders from './Orders'; // Import the new Orders component
import CustomerRequestForm from './CustomerRequestForm';
import Login from './login'; // Import Login component
import LogOut from './logout';
import ForgotPassword from './ForgotPassword';
import EmailChange from './EmailChange';
import Check from './check';
import DeletionRequest from './DeletionRequest';
import Home from './Home';
import Menu from './Menu';

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
        {isAuthenticated }
        <div className="main-container">
          <Routes>
            {/* Login is the default (index) route */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/AccountInfo" /> : <Login />} />
            
            {/* Protect these routes - only accessible if logged in */}
            <Route path="/Home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
            <Route path="/Menu" element={isAuthenticated ? <Menu /> : <Navigate to="/" />} />

            <Route path="/AccountInfo" element={isAuthenticated ? <AccountInfo /> : <Navigate to="/" />} />
            <Route path="/Security" element={isAuthenticated ? <Security /> : <Navigate to="/" />} />
            <Route path="/Orders" element={isAuthenticated ? <Orders /> : <Navigate to="/" />} />
            <Route path="/CustomerRequests" element={isAuthenticated ? <CustomerRequestForm /> : <Navigate to="/" />} />
            <Route path="/LogOut" element={isAuthenticated ? <LogOut /> : <Navigate to="/" />} />
            <Route path="/ForgotPassword" element={isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />
            <Route path="/EmailChange" element={isAuthenticated ? <EmailChange /> : <Navigate to= "/" />} />
            <Route path="/check" element={isAuthenticated ? <Check /> : <Navigate to="/" />}/>
            <Route path="/DeletionRequest" element={isAuthenticated ? <DeletionRequest /> : <Navigate to="/" />}/>
          </Routes>
        </div>
      </div>
    </>
  );
}
