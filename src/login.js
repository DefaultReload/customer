import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Importing icons
import Signup from './signup';
import Profile from './Home';
import loginImage from './assets/login.png';

import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginAttempts >= 5) {
      setLockout(true);
      const timeout = setTimeout(() => {
        setLockout(false);
        setLoginAttempts(0);
      }, 20000);
      return () => clearTimeout(timeout);
    }
  }, [loginAttempts]);

  const handleLogin = async () => {
    setError(null);
    const normalizedEmail = email.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setError('Invalid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (lockout) {
      setError('Too many unsuccessful attempts. Please try again in 20 seconds.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert('Email Verification Required. Please verify your email before logging in.');
        await auth.signOut();
        return;
      }

      alert(`Login Successful. Welcome, ${user.email}!`);
      navigate('/profile'); // Redirect to profile page after login
    } catch (err) {
      console.error('Login error:', err);
      handleAuthError(err);
      setLoginAttempts((prevAttempts) => prevAttempts + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (err) => {
    switch (err.code) {
      case 'auth/user-not-found':
        setError('No user found with this email.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again.');
        break;
      case 'auth/invalid-email':
        setError('The email address is badly formatted.');
        break;
      case 'auth/user-disabled':
        setError('This user has been disabled. Please contact support.');
        break;
      default:
        setError('Login failed. Please check your credentials and try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showSignup) {
    return <Signup />;
  }

  return (
    <div className="login-page">
      <img src={loginImage} alt="Login" className="login-image" />

      <div className="login-container">
        <h1>Login</h1>

        <div className="input-container">
          <FaEnvelope className="icon" /> {/* Email Icon */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>

        <div className="input-container">
          <FaLock className="icon password-icon" /> {/* Password Icon */}
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>

        <button onClick={togglePasswordVisibility} className="password-toggle">
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>

        <button
          onClick={handleLogin}
          disabled={loading || lockout}
          className="login-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="error-text">{error}</p>}

        <p className="sign-up-text">
          Don't have an account?{' '}
          <span onClick={() => setShowSignup(true)} className="sign-up-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
