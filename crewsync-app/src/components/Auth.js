import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

function Auth({ isInitialLogin }) {
  const [isLogin, setIsLogin] = useState(isInitialLogin);
  // NEW STATE for the user's name
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('volunteer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const auth = getAuth();
    const db = getFirestore();

    if (isLogin) {
      // Login logic is unchanged
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Registration logic now includes the name
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save the user's profile, now including their name
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          role: role,
          name: fullName // <-- Save the name here
        });

      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        {/* NEW: Full Name field, only shown on register form */}
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

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
