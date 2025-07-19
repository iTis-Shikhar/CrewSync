import React, { useState, useEffect, createContext } from 'react';
import './App.css'; // Link to our custom CSS

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';

// Context for Firebase and User
export const FirebaseContext = createContext(null);

function App() {
  // State for Firebase and user
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loadingFirebase, setLoadingFirebase] = useState(true);
  const [error, setError] = useState(null);

  // IMPORTANT: localFirebaseConfig now reads the API key from the .env file.
  // You MUST replace the placeholder values for authDomain, projectId, etc.,
  // with YOUR ACTUAL VALUES from your Firebase Console.
  // Make sure these match the config you copied when setting up your Firebase web app.
  const localFirebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // This reads from your .env file!
  authDomain: "crewsynchackathon.firebaseapp.com",
  projectId: "crewsynchackathon",
  storageBucket: "crewsynchackathon.firebasestorage.app",
  messagingSenderId: "732421258194",
  appId: "1:732421258194:web:33369a868afe9ad885660b"
  };

  // useEffect for Firebase initialization
  useEffect(() => {
    const setupFirebase = async () => {
      try {
        // Safely access Canvas-provided globals, falling back to local values for local development
        const currentFirebaseConfig =
          typeof __firebase_config !== 'undefined' && __firebase_config !== null
            ? JSON.parse(__firebase_config)
            : localFirebaseConfig;

        const initialAuthToken =
          typeof __initial_auth_token !== 'undefined' && __initial_auth_token !== null
            ? __initial_auth_token
            : null;

        // Basic check to ensure config is present and has an API key
        if (!currentFirebaseConfig || !currentFirebaseConfig.apiKey) {
          throw new Error("Firebase configuration is missing or incomplete. Please ensure REACT_APP_FIREBASE_API_KEY is set in your .env file and other config values are correct in App.js.");
        }

        const app = initializeApp(currentFirebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);

        setDb(firestoreDb);
        setAuth(firebaseAuth);

        // Authenticate user using the provided token or anonymously
        if (initialAuthToken) {
          await signInWithCustomToken(firebaseAuth, initialAuthToken);
        } else {
          await signInAnonymously(firebaseAuth); // Fallback for local testing or unauthenticated users
        }

        // Listen for auth state changes to get the current user ID
        onAuthStateChanged(firebaseAuth, (user) => {
          if (user) {
            setUserId(user.uid);
            console.log("User authenticated:", user.uid);
          } else {
            setUserId(null);
            console.log("No user authenticated.");
          }
          setLoadingFirebase(false); // Firebase setup and initial auth check complete
        });

      } catch (err) {
        console.error("Failed to initialize Firebase:", err);
        setError("Failed to initialize Firebase: " + err.message);
        setLoadingFirebase(false);
      }
    };

    setupFirebase();
  }, []); // Run only once on component mount

  // Conditional Rendering for Loading/Error States
  if (loadingFirebase) {
    return (
      <div className="loading-container">
        <p className="loading-message">Loading CrewSync...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={{ db, auth, userId }}>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">CrewSync</h1>
            {userId && (
              <div className="user-info">
                <span className="user-id-display">User ID: {userId}</span>
                <button
                  onClick={() => signOut(auth)}
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="main-content">
          <h2 className="welcome-heading">Welcome to the Admin Dashboard!</h2>
          <p className="status-message">
            Firebase is initialized and connected. User ID: {userId || 'Not authenticated'}.
            Let's start managing your events, volunteers, and shifts!
          </p>

          <section className="info-card">
            <h3 className="card-title">Your CrewSync Journey:</h3>
            <ul className="feature-list">
              <li>**Step 1:** Complete Firebase project setup in the Google Cloud Console (already done!).</li>
              <li>**Step 2:** Implement Admin Login/Logout (next step!).</li>
              <li>**Step 3:** Build Event Management (CRUD).</li>
              <li>**Step 4:** Build Volunteer Management (CRUD).</li>
              <li>**Step 5:** Build Shift Management (CRUD & Assignment).</li>
              <li>**Step 6:** Create Volunteer Personalized View.</li>
            </ul>
          </section>

          {/* Placeholder for future components like Event, Volunteer, Shift management forms/lists */}
          <section className="info-card">
            <h3 className="card-title">Core Management Areas:</h3>
            <p className="placeholder-text">
                This area will contain forms and lists for managing Events, Volunteers, and Shifts.
                We'll build these components next, integrating with Firebase Firestore.
            </p>
          </section>

        </main>
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
