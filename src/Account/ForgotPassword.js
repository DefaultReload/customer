import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; // Import sendPasswordResetEmail from Firebase
import { auth } from './firebaseConfig'; // Import Firebase authentication
import './ForgotPassword.css'; // Uncomment if you want to use CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      window.alert('Please enter an email address.');
      return;
    }

    setLoading(true);

    try {
      // Send the password reset email
      await sendPasswordResetEmail(auth, email);
      window.alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        window.alert('No account found with this email.');
      } else {
        window.alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="title">Update Password</h2>

<p>Your password will be updated. A link to reset your password has been sent to your email </p>
      {/* Label for Email */}
      <label className="email-label" htmlFor="email">
        Email
      </label>
      <input
        className="input"
        id="email" // Link label to input with "for" and "id"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoCapitalize="none"
      />

      <button
        className="password-submit-button"
        onClick={handlePasswordReset}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Update Password'}
      </button>
    </div>
  );
};

export default ForgotPassword;
