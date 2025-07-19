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
  const [userName, setUserName] = useState(null);
  const [loadingFirebase, setLoadingFirebase] = useState(true);
  
  const [page, setPage] = useState('landing');
  const [selectedEventId, setSelectedEventId] = useState(null);

  // THIS IS THE CORRECTED CONFIGURATION OBJECT
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "crewsynchackathon.firebaseapp.com",
    projectId: "crewsynchackathon",
    storageBucket: "crewsynchackathon.appspot.com",
    messagingSenderId: "732421258194",
    appId: "1:732421258194:web:33369a868afe9ad885660b"
  };

  useEffect(() => {
    try {
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
            const userData = userDocSnap.data();
            setUserRole(userData.role);
            setUserName(userData.name);
          }
          if (page === 'landing' || page === 'login' || page === 'register') {
            setPage('dashboard');
          }
        } else {
          setUserId(null);
          setUserRole(null);
          setUserName(null);
          if (page !== 'landing' && page !== 'login' && page !== 'register') {
            setPage('landing');
          }
        }
        setLoadingFirebase(false);
      });
    } catch (err) {
      console.error("Firebase Initialization Error:", err);
      setLoadingFirebase(false);
    }
  }, [page]); // Dependency array updated to handle re-renders correctly

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  if (loadingFirebase) {
    return <div className="loading-container"><p>Loading CrewSync...</p></div>;
  }

  const renderPage = () => {
    if (userId) {
      if (userRole === 'admin') {
        switch (page) {
          case 'dashboard': return <AdminDashboard setPage={setPage} />;
          case 'createEvent': return <CreateEventForm setPage={setPage} />;
          case 'eventList': return <EventList setPage={setPage} setSelectedEventId={setSelectedEventId} />;
          case 'manageEvent': return <ManageEventPage eventId={selectedEventId} setPage={setPage} />;
          case 'about': return <AboutPage />;
          case 'help': return <HelpPage />;
          default: return <AdminDashboard setPage={setPage} />;
        }
      } else if (userRole === 'volunteer') {
        switch (page) {
          case 'dashboard': return <VolunteerDashboard />;
          case 'about': return <AboutPage />;
          case 'help': return <HelpPage />;
          default: return <VolunteerDashboard />;
        }
      }
    }
    // Public pages
    switch (page) {
      case 'login': return <Auth isInitialLogin={true} />;
      case 'register': return <Auth isInitialLogin={false} />;
      case 'about': return <AboutPage />;
      case 'help': return <HelpPage />;
      default: return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <FirebaseContext.Provider value={{ auth, db, userId, userRole, userName }}>
      <div className="app-container">
        <Navbar setPage={setPage} userId={userId} userName={userName} handleLogout={handleLogout} />
        <main>{renderPage()}</main>
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
