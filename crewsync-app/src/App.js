import React, { useState, useEffect, createContext } from 'react';
import './App.css';

// Import all our components
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import VolunteerDashboard from './components/VolunteerDashboard';
import AboutPage from './components/AboutPage';
import HelpPage from './components/HelpPage';
import CreateEventForm from './components/CreateEventForm';
import EventList from './components/EventList';
import ManageEventPage from './components/ManageEventPage';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const FirebaseContext = createContext(null);

function App() {
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loadingFirebase, setLoadingFirebase] = useState(true);
  
  // Navigation state
  const [page, setPage] = useState('landing');
  const [selectedEventId, setSelectedEventId] = useState(null);

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
        setUserId(user.uid);
        const userDocRef = doc(dbInstance, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserRole(userDocSnap.data().role);
        }
        // Don't auto-navigate here to preserve navigation state
      } else {
        setUserId(null);
        setUserRole(null);
        // If user logs out, send them to the landing page
        if (page.startsWith('dashboard') || page.startsWith('event') || page.startsWith('manage')) {
          setPage('landing');
        }
      }
      setLoadingFirebase(false);
    });
  }, []);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  if (loadingFirebase) {
    return <div className="loading-container"><p>Loading CrewSync...</p></div>;
  }

  const renderPage = () => {
    // If user is logged in, check their role and show the appropriate dashboard view
    if (userId) {
      if (userRole === 'admin') {
        switch (page) {
          case 'dashboard': return <AdminDashboard setPage={setPage} />;
          case 'createEvent': return <CreateEventForm setPage={setPage} />;
          case 'eventList': return <EventList setPage={setPage} setSelectedEventId={setSelectedEventId} />;
          case 'manageEvent': return <ManageEventPage eventId={selectedEventId} setPage={setPage} />;
          case 'about': return <AboutPage />;
          case 'help': return <HelpPage />;
          default: return <AdminDashboard setPage={setPage} />; // Default to main dashboard
        }
      } else if (userRole === 'volunteer') {
        // Volunteer routing can be expanded here later
        switch (page) {
          case 'about': return <AboutPage />;
          case 'help': return <HelpPage />;
          default: return <VolunteerDashboard />;
        }
      }
    }

    // If no user is logged in, show public pages
    switch (page) {
      case 'login': return <Auth isInitialLogin={true} />;
      case 'register': return <Auth isInitialLogin={false} />;
      case 'about': return <AboutPage />;
      case 'help': return <HelpPage />;
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
