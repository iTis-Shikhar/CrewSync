import React, { useState } from 'react';
// Import Firebase tools
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

function Auth({ isInitialLogin }) {
  const [isLogin, setIsLogin] = useState(isInitialLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NEW STATE: To hold the selected role
  const [role, setRole] = useState('volunteer'); // Default to 'volunteer'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const auth = getAuth();
    const db = getFirestore();

    if (isLogin) {
      // Login logic remains the same
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // App.js will handle redirecting after login
      } catch (err) {
        setError(err.message);
      }
    } else {
      // --- REGISTRATION LOGIC ---
      try {
        // Step 1: Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Step 2: Create a document in the 'users' collection in Firestore
        // The document ID will be the same as the user's UID from Authentication
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: role // Save the selected role
        });
        
        // After successful registration, App.js will automatically log them in
        // and redirect them to their new dashboard.

      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {/* --- NEW: ROLE SELECTOR --- */}
        {/* This block only appears on the Register form */}
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="role">Register as...</label>
            <select id="role" className="role-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="volunteer">A Volunteer</option>
              <option value="admin">An Event Organizer</option>
            </select>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button">
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p className="toggle-form">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? ' Register' : ' Login'}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Auth;
