import React, { useEffect, useState } from 'react';
import { db, auth } from './firebaseConfig'; // Import Firebase configuration
import { ref, get } from 'firebase/database'; // Import methods for Firebase Database

// Function to check if the current user's email exists in the 'userEmail' field of the 'bookings' database
const checkUserEmail = async () => {
    try {
        // Get the currently signed-in user
        const user = auth.currentUser;

        if (!user) {
            console.log('No user is currently signed in');
            return null;
        }

        // Get the email of the currently signed-in user
        const userEmail = user.email;
        console.log('Checking for user email:', userEmail);

        // Reference to the 'bookings' node in the Firebase Realtime Database
        const bookingsRef = ref(db, 'bookings');
        
        // Fetch the data from the bookings reference
        const snapshot = await get(bookingsRef);
        const bookings = snapshot.val();

        // Create a Set to store user emails from the bookings
        const emailSet = new Set();

        // Populate the Set with user emails from bookings
        for (let bookingId in bookings) {
            const email = bookings[bookingId].assignedPods?.userEmail;
            if (email) {
                emailSet.add(email);
            }
        }

        // Check if the current user's email exists in the Set
        const emailExists = emailSet.has(userEmail);

        // Return the result of the email check
        if (emailExists) {
            console.log('Email exists in bookings');
            return true;
        } else {
            console.log('Email does not exist in bookings');
            return false;
        }

    } catch (error) {
        console.error('Error checking user email:', error);
        return null;
    }
};

const EmailCheckComponent = () => {
    const [emailExists, setEmailExists] = useState(null); // State to store email existence result
    const [loading, setLoading] = useState(true); // State to manage loading status

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const exists = await checkUserEmail(); // Wait for the Promise to resolve
                setEmailExists(exists); // Update state based on result
            } catch (error) {
                console.error('Error checking email:', error);
            } finally {
                setLoading(false); // Set loading to false after the check is done
            }
        };

        verifyEmail(); // Call the function to check email
    }, []); // Empty dependency array to run only on mount

    if (loading) {
        return <div>Loading...</div>; // Show loading message while checking
    }

    return (
        <div>
            {emailExists !== null ? (
                emailExists ? (
                    <p>Email exists in bookings</p>
                ) : (
                    <p>Email does not exist in bookings</p>
                )
            ) : (
                <p>Error checking email.</p>
            )}
        </div>
    );
};

export default EmailCheckComponent;