import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from './firebase';

function AuthComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignUp = async () => {
    setError('');
    setMessage('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Sign up successful!');
      setIsLoggedIn(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    setError('');
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
      setIsLoggedIn(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    setError('');
    setMessage('');
    try {
      await signOut(auth);
      setMessage('Logout successful!');
      setIsLoggedIn(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Firebase Authentication</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      
      {!isLoggedIn ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="form-control"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="form-control"
          />
          <button onClick={handleSignUp} className="btn btn-primary mt-2 form-control-button">
            Sign Up
          </button>
          <button onClick={handleLogin} className="btn btn-success mt-2 mx-2 form-control-button">
            Login
          </button>
          <button onClick={handlePasswordReset} className="btn btn-warning mt-2 mx-2 form-control-button">
            Forgot Password
          </button>
        </>
      ) : (
        <button onClick={handleLogout} className="btn btn-danger mt-2 form-control-button">
          Logout
        </button>
      )}
    </div>
  );
}

export default AuthComponent;