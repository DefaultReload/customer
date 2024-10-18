import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig'; // Import Realtime Database and Auth from config
import { ref, push, set } from 'firebase/database'; // Realtime Database methods
import { signInWithEmailAndPassword } from 'firebase/auth'; // For email/password authentication

const DeletionRequestForm = () => {
    const [userEmail, setUserEmail] = useState('');
    const [deletionReason, setDeletionReason] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [password, setPassword] = useState(''); // State for password
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    // Fetch the current logged-in user's email from Firebase Authentication
    useEffect(() => {
        const fetchUserEmail = () => {
            const user = auth.currentUser;
            if (user) {
                setUserEmail(user.email); // Set the email if user is authenticated
            } else {
                setUserEmail('No user logged in'); // Fallback if no user is logged in
            }
        };
        fetchUserEmail();
    }, []);

    // Handle input change for reason
    const handleReasonChange = (e) => {
        setDeletionReason(e.target.value);
    };

    // Handle input change for password
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Handle radio button change for confirmation
    const handleConfirmationChange = (e) => {
        setIsConfirmed(e.target.value === 'yes');
    };

    // Handle adding a new deletion request to Realtime Database
    const handleAddDeletionRequest = async () => {
        if (!isConfirmed) {
            window.alert('You need to confirm your decision before submitting.');
            return;
        }

        try {
            // Sign in with email and password to verify the user's identity
            await signInWithEmailAndPassword(auth, userEmail, password);

            const deletionId = push(ref(db, 'deletion')).key; // Generate a new deletion ID in Realtime Database

            const deletionPayload = {
                email: userEmail,
                reason: deletionReason,
            };

            await set(ref(db, `deletion/${deletionId}`), deletionPayload); // Save to Realtime Database
            window.alert('Deletion request submitted successfully!');
            resetForm(); // Clear form after submitting
        } catch (error) {
            console.error('Error submitting deletion request:', error);
            if (error.code === 'auth/wrong-password') {
                setErrorMessage('Incorrect password. Please try again.');
            } else {
                window.alert('Error: Could not submit the request');
            }
        }
    };

    // Reset the form fields
    const resetForm = () => {
        setDeletionReason('');
        setIsConfirmed(false);
        setPassword(''); // Clear the password field
        setErrorMessage(''); // Clear any error messages
    };

    return (
        <div className="form-container">
            <h1>Deletion Request Form</h1>

            <div className="form-content">
                <h3>Are you sure you want to delete your request?</h3>

                <div className="confirmation-row">
                    <label>Confirm Deletion:</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="confirmation"
                                value="no"
                                checked={!isConfirmed}
                                onChange={handleConfirmationChange}
                            />{' '}
                            No
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="confirmation"
                                value="yes"
                                checked={isConfirmed}
                                onChange={handleConfirmationChange}
                            />{' '}
                            Yes
                        </label>
                    </div>
                </div>

                <div className="request-row">
                    <label>Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={userEmail}
                        readOnly
                        className="email-input"
                    />
                </div>

                <div className="request-row">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        className="password-input"
                    />
                </div>

                <div className="request-row">
                    <label>Reason for Deletion:</label>
                    <textarea
                        name="reason"
                        value={deletionReason}
                        onChange={handleReasonChange}
                        placeholder="Enter reason for deletion"
                        className="reason-input"
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button className="submit-button" onClick={handleAddDeletionRequest}>
                    Submit Deletion Request
                </button>
            </div>
        </div>
    );
};

export default DeletionRequestForm;
