import React, { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';

const Logout = () => {
  const auth = getAuth(); // Get the Firebase Auth instance

  useEffect(() => {
    // Function to log out the user
    const handleLogout = async () => {
      try {
        await signOut(auth); // Firebase sign-out method
        // Redirect the user to the login page using <a> tag
        window.location.href = '/'; // This simulates an anchor link click
      } catch (error) {
        console.error("Error logging out: ", error);
      }
    };

    handleLogout();
  }, [auth]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
