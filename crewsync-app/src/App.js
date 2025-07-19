import React, { useState, useEffect, createContext } from 'react';
import './App.css';

// Import components from their new location
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export const FirebaseContext = createContext(null);

function App() {
  // State for Firebase and user
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loadingFirebase, setLoadingFirebase] = useState(true);

  // NEW STATE: Manages which page is currently visible
  const [page, setPage] = useState('landing'); // 'landing', 'login', 'register', or 'dashboard'

  // Your Firebase config
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "crewsynchackathon.firebaseapp.com",
    projectId: "crewsynchackathon",
    storageBucket: "crewsynchackathon.appspot.com",
    messagingSenderId: "732421258194",
    appId: "1:732421258194:web:33369a868afe9ad885660b"
  };

  // Initialize Firebase and set up auth listener
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      setAuth(authInstance);

      onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setUserId(user.uid);
          // If a user is logged in, automatically take them to the dashboard
          setPage('dashboard');
        } else {
          setUserId(null);
          // If no user, and they aren't trying to log in/register, show landing page
          if (page === 'dashboard') {
            setPage('landing');
          }
        }
        setLoadingFirebase(false);
      });
    } catch (e) {
      console.error("Firebase Initialization Error:", e);
      setLoadingFirebase(false);
    }
  }, [page]); // Re-run effect if page state changes

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  // Render a loading message while Firebase is initializing
  if (loadingFirebase) {
    return <div className="loading-container"><p>Loading CrewSync...</p></div>;
  }

  // Main render logic based on the 'page' state
  const renderPage = () => {
    switch (page) {
      case 'login':
        // We pass 'login' to the Auth component to tell it which mode to be in
        return <Auth isInitialLogin={true} />;
      case 'register':
        // We pass 'register' to the Auth component
        return <Auth isInitialLogin={false} />;
      case 'dashboard':
        // Show dashboard only if a user is actually logged in
        return userId ? <Dashboard handleLogout={handleLogout} /> : <LandingPage setPage={setPage} />;
      case 'landing':
      default:
        return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <FirebaseContext.Provider value={{ auth, userId }}>
      <div className="app-container">
        {renderPage()}
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
