import React, { useEffect, useState } from 'react';
import { auth, db } from './firebaseConfig'; // Adjust the import based on your folder structure
import { ref, child, get, set } from 'firebase/database';
import './AccountInfo.css'; // Import CSS file
import AccountNav from './AccountNav'; // Make sure the path is correct

const AccountInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState(''); 
  const [newSurname, setNewSurname] = useState(''); 
  const [newEmail, setNewEmail] = useState(''); 
  const [isUpdatingName, setIsUpdatingName] = useState(false); 
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const email = currentUser.email;
          const formattedEmail = email.replace(/\./g, '_'); // Replace dots with underscores

          const dbRef = ref(db);
          const snapshot = await get(child(dbRef, `users/${formattedEmail}`)); // Query by formatted email

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserInfo(userData);
            setNewEmail(userData.email); 
          } else {
            console.log("No user data found at path users/" + formattedEmail);
          }
        }
      } catch (error) {
        console.error("Error fetching user info: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpdateName = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const email = currentUser.email;
        const formattedEmail = email.replace(/\./g, '_');

        // Update user data in the database
        const userRef = ref(db, `users/${formattedEmail}`);
        await set(userRef, {
          ...userInfo,
          name: newName,
          surname: newSurname,
          email: userInfo.email, // Keep the old email
        }); 

        // Update local state
        setUserInfo((prev) => ({ ...prev, name: newName, surname: newSurname }));
        setNewName(''); 
        setNewSurname(''); 
        setIsUpdatingName(false); 
        alert('Success: Name and surname updated successfully!'); 
      }
    } catch (error) {
      console.error("Error updating user info: ", error);
      alert('Error: Failed to update name and surname.');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const email = currentUser.email;
        const formattedEmail = email.replace(/\./g, '_');

        // Update user data in the database
        const userRef = ref(db, `users/${formattedEmail}`);
        await set(userRef, {
          ...userInfo,
          name: userInfo.name, 
          surname: userInfo.surname, 
          email: newEmail,
        }); 

        // Update local state
        setUserInfo((prev) => ({ ...prev, email: newEmail }));
        setNewEmail(''); 
        setIsUpdatingEmail(false); 
        alert('Success: Email updated successfully!'); 

        // Update email authentication if necessary
        if (newEmail !== email) {
          await currentUser.updateEmail(newEmail); 
        }
      }
    } catch (error) {
      console.error("Error updating email: ", error);
      alert('Error: Failed to update email.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userInfo) {
    return (
      <div className="error-container">
        <p>No user information available.</p>
      </div>
    );
  }

  return (
    <div>
      <AccountNav /> {/* Corrected rendering of AccountNav */}
      <div className="account-info-container">
        <h2 className="account-title">Account Info</h2>
        <h3 className="basic-info-title">Basic Information</h3>

        <div className="user-info">
          <span className="user-info-label">Name:</span>
          <span className="user-info-value">{userInfo.name} {userInfo.surname}</span>
        </div>

        {isUpdatingName ? (
          <>
            <input
              className="input-field"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Enter new surname"
              value={newSurname}
              onChange={(e) => setNewSurname(e.target.value)}
            />
            <button className="update-button" onClick={handleUpdateName}>
              Save Name and Surname
            </button>
            <button className="cancel-button" onClick={() => setIsUpdatingName(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="update-button" onClick={() => setIsUpdatingName(true)}>
            Update Name and Surname
          </button>
        )}

        <div className="user-info">
          <span className="user-info-label">Email:</span>
          <span className="user-info-value">{userInfo.email}</span>
        </div>

        {isUpdatingEmail ? (
          <>
            <input
              className="input-field"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              type="email" 
            />
            <button className="update-button" onClick={handleUpdateEmail}>
              Save Email
            </button>
            <button className="cancel-button" onClick={() => setIsUpdatingEmail(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="update-button" onClick={() => setIsUpdatingEmail(true)}>
            Update Email
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
