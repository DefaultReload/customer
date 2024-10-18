import React, { useState } from 'react';
import { auth, db } from './firebaseConfig'; // Adjust path as necessary
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import zxcvbn from 'zxcvbn';
import Login from './login'; // Adjust the path as necessary
import './signup.css'

function SignUp() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const validateFullName = (name) => /^[A-Za-z\s]+$/.test(name);

  const checkPasswordStrength = (password) => {
    const strength = zxcvbn(password);
    setPasswordStrength(strength.score);
  };

  const togglePasswordVisibility = (setVisibilityFunc) => {
    setVisibilityFunc((prev) => !prev);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!validateFullName(name) || !validateFullName(surname)) {
      setError('Full name can only contain letters and spaces.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const sanitizedEmail = email.replace(/\./g, '_');

      await set(ref(db, 'users/' + sanitizedEmail), {
        name,
        surname,
        email,
      });

      alert('A verification email has been sent to your email address. Please verify your email to continue.');

      setShowLogin(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showLogin) {
    return <Login />;
  }

  return (
    <div className="signup-container">
      <h1 className="signup-title">SCreate New Account</h1>
      <form onSubmit={handleSignup}>
        <input
          className='signup-input'
          label = 'Name'
          placeholder="First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name" // Correct autocomplete for first name
        />
        <input
          className='signup-input'
          label = 'Surname'
          placeholder="Last Name"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          autoComplete="family-name" // Correct autocomplete for last name
        />
        <input
          className='signup-input'
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email" // Correct autocomplete for email
        />

        <div className='signup-passwordContainer'>
          <input
            className='signup-input'
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordStrength(e.target.value);
            }}
            autoComplete="new-password" // Correct autocomplete for new passwords
          />
          <button type="button" onClick={() => togglePasswordVisibility(setShowPassword)} className='toggleButton'>
            👁️
          </button>
          <progress max="4" value={passwordStrength} className='progressBar' />
          <p>Password Strength: {['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength]}</p>
        </div>

        <div className='signup-passwordContainer'>
          <input
            className='signup-input'
            placeholder="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password" // Match autocomplete for confirming new password
          />
          <button type="button" onClick={() => togglePasswordVisibility(setShowConfirmPassword)} className='toggleButton'>
            👁️
          </button>
        </div>

        {error && <p className='error'>{error}</p>}
        {loading && <div className='loading'>Loading...</div>}

        <button className='signup-submit-button' type="submit" disabled={loading}>
          Sign Up
        </button>
      </form>

      <p className='footerText'>
        Already have an account?{' '}
        <button type="button" onClick={() => setShowLogin(true)} className='link'>
          Sign In
        </button>
      </p>
    </div>
  );
}

export default SignUp;
