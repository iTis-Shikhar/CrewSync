import React, { useState, useEffect, createContext } from 'react';
import './App.css';

// Import all our components
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard'; // Renamed
import VolunteerDashboard from './components/VolunteerDashboard'; // New
import AboutPage from './components/AboutPage';
import HelpPage from './components/HelpPage';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import getDoc

export const FirebaseContext = createContext(null);

function App() {
  // State for Firebase and user
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  // NEW STATE: To store the logged-in user's role
  const [userRole, setUserRole] = useState(null);
  const [loadingFirebase, setLoadingFirebase] = useState(true);
  const [page, setPage] = useState('landing');

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "crewsynchackathon.firebaseapp.com",
    projectId: "crewsynchackathon",
    storageBucket: "crewsynchackathon.appspot.com",
    messagingSenderId: "732421258194",
    appId: "1:732421258194:web:33369a868afe9ad885660b"
  };

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app);
    setAuth(authInstance);
    setDb(dbInstance);

    onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        // --- USER IS LOGGED IN ---
        setUserId(user.uid);
        // Now, fetch their role from Firestore
        const userDocRef = doc(dbInstance, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role); // Set the user's role
        } else {
          // This case might happen if a user exists in Auth but not in Firestore
          console.log("User document not found in Firestore!");
          setUserRole(null);
        }
        setPage('dashboard');
      } else {
        // --- USER IS LOGGED OUT ---
        setUserId(null);
        setUserRole(null);
        if (page === 'dashboard') {
          setPage('landing');
        }
      }
      setLoadingFirebase(false);
    });
  }, []); // Run only once

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  if (loadingFirebase) {
    return <div className="loading-container"><p>Loading CrewSync...</p></div>;
  }

  const renderPage = () => {
    switch (page) {
      case 'login': return <Auth isInitialLogin={true} />;
      case 'register': return <Auth isInitialLogin={false} />;
      case 'about': return <AboutPage />;
      case 'help': return <HelpPage />;
      case 'dashboard':
        // --- ROLE-BASED ROUTING ---
        if (!userId) return <LandingPage setPage={setPage} />; // Should not happen, but a safeguard
        if (userRole === 'admin') return <AdminDashboard />;
        if (userRole === 'volunteer') return <VolunteerDashboard />;
        // Fallback while role is loading or if role is not found
        return <div className="loading-container"><p>Loading Dashboard...</p></div>;
      case 'landing':
      default:
        return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <FirebaseContext.Provider value={{ auth, db, userId, userRole }}>
      <div className="app-container">
        <Navbar setPage={setPage} userId={userId} handleLogout={handleLogout} />
        <main>{renderPage()}</main>
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
