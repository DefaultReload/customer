import React, { useState } from 'react';
import { db } from './firebaseConfig'; // Adjust the import based on your file structure
import { ref, onValue, push, set } from 'firebase/database';
import './CustomerRequestForm.css';
import AccountNav from './AccountNav'; // Make sure the path is correct

const CustomerRequestForm = () => {
    const [requestData, setRequestData] = useState({
        blanket: '',
        extraStorage: '',
        pillows: '',
    });

    const [quantities, setQuantities] = useState({
        blanket: 0,
        extraStorage: 0,
        pillows: 0 
    });

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [podId, setPodId] = useState('');
    const [bookingFound, setBookingFound] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequestData({ ...requestData, [name]: value });
    };

    const handleQuantityChange = (e) => {
        const { name, value } = e.target;
        setQuantities({ ...quantities, [name]: Number(value) });
    };

    const fetchBookingByEmail = async (userEmail) => {
        setLoading(true);
        const bookingsRef = ref(db, 'bookings');
        onValue(bookingsRef, (snapshot) => {
            let found = false;
            snapshot.forEach((childSnapshot) => {
                const booking = childSnapshot.val();
                if (booking.email === userEmail) {
                    if (booking.assignedPods && booking.assignedPods.length > 0) {
                        setPodId(booking.assignedPods[0].podId);
                    }
                    setBookingFound(true);
                    found = true;
                }
            });
            if (!found) {
                resetBookingState();
                window.alert('No booking found for this email.');
            } else {
                window.alert('Booking found! Pod ID: ' + podId);
            }
            setLoading(false);
        });
    };

    const resetBookingState = () => {
        setPodId('');
        setBookingFound(false);
    };

    const handleAddRequest = async () => {
        if (!bookingFound) {
            window.alert('Please fetch your booking first.');
            return;
        }

        const requestId = push(ref(db, 'requests')).key;

        const now = new Date();
        const submittedDate = now.toLocaleDateString();
        const submittedTime = now.toLocaleTimeString();

        const requestPayload = {
            ...requestData,
            quantities: quantities,
            podId: podId,
            name: name,
            submittedDate,
            submittedTime
        };

        for (const key in quantities) {
            if (requestData[key] === 'yes' && quantities[key] <= 0) {
                window.alert(`Please enter a valid quantity for ${key}.`);
                return;
            }
        }

        try {
            await set(ref(db, `requests/${requestId}`), requestPayload);
            window.alert('Request added successfully!');
            resetForm();
        } catch (error) {
            console.error('Error adding request:', error);
            window.alert('Could not add request');
        }
    };

    const resetForm = () => {
        setRequestData({
            blanket: '',
            extraStorage: '',
            pillows: '',
        });
        setQuantities({
            blanket: 0,
            extraStorage: 0,
            pillows: 0
        });
        setEmail('');
        setName('');
        resetBookingState();
    };

    return (
        <div>
            <AccountNav />
            <div className="customer-form-container">
                <h2 className="form-header">Welcome to Customer Service</h2>

                <div className="email-input-group">
                    <label className="form-label">
                        Email:
                        <input 
                            className="input-field"
                            type="email" 
                            value={email} 
                            onChange={(e) => {
                                setEmail(e.target.value);
                                resetBookingState();
                            }} 
                            placeholder="Enter Email"
                        />
                    </label>
                    <button 
                        className="fetch-button" 
                        onClick={() => fetchBookingByEmail(email)} 
                        disabled={loading}
                    >
                        {loading ? 'Fetching...' : 'Fetch Booking'}
                    </button>
                </div>

                <div className="input-group">
                    <label className="form-label">
                        Name:
                        <input 
                            className="input-field"
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Enter Name"
                            disabled={!bookingFound}
                        />
                    </label>
                </div>

                <div className="request-section">
                    <label className="form-label">Requests:</label>
                    <div className="request-group">
                        {['blanket', 'extraStorage', 'pillows'].map(item => (
                            <div key={item} className="radio-input-group">
                                <span>{item.charAt(0).toUpperCase() + item.slice(1)}:</span>
                                <input
                                    type="radio"
                                    id={`${item}-no`}
                                    name={item}
                                    value="no"
                                    checked={requestData[item] === 'no'}
                                    onChange={handleChange}
                                    disabled={!bookingFound}
                                />
                                <label htmlFor={`${item}-no`}>No</label>
                                <input
                                    type="radio"
                                    id={`${item}-yes`}
                                    name={item}
                                    value="yes"
                                    checked={requestData[item] === 'yes'}
                                    onChange={handleChange}
                                    disabled={!bookingFound}
                                />
                                <label htmlFor={`${item}-yes`}>Yes</label>
                                <input
                                    type="number"
                                    className="quantity-input"
                                    name={item}
                                    value={quantities[item]}
                                    onChange={handleQuantityChange}
                                    min="0"
                                    disabled={!bookingFound || requestData[item] === 'no'}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    className="submit-button" 
                    onClick={handleAddRequest} 
                    disabled={!bookingFound}
                >
                    Submit Request
                </button>
            </div>
        </div>
    );
};

export default CustomerRequestForm;
