// src/Auth.js

import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function Auth({ isInitialLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(isInitialLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const auth = getAuth();

    if (isLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .catch((err) => setError(err.message));
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .catch((err) => setError(err.message));
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? 'Admin Login' : 'Admin Sign Up'}</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required placeholder="Enter your password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p className="toggle-form">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? ' Sign Up' : ' Login'}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Auth;