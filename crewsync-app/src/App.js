import React, { useState, useEffect, createContext } from 'react';
import './App.css';

// Import all components (except the one we're deleting)
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import AdminWorkspace from './components/AdminWorkspace';
import Sidebar from './components/Sidebar';
import VolunteerDashboard from './components/VolunteerDashboard';
import AboutPage from './components/AboutPage';
import HelpPage from './components/HelpPage';
import CreateEventForm from './components/CreateEventForm';
import EventList from './components/EventList';
import ManageEventPage from './components/ManageEventPage';
import AnalyticsPage from './components/AnalyticsPage';
// We no longer import VolunteerManagementPage

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
  const [error, setError] = useState(null);
  
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
          setUserId(null); setUserRole(null); setUserName(null);
          if (page !== 'landing' && page !== 'login' && page !== 'register') {
            setPage('landing');
          }
        }
        setLoadingFirebase(false);
      });
    } catch (err) {
      console.error("Firebase Initialization Error:", err);
      setError("Failed to initialize Firebase.");
      setLoadingFirebase(false);
    }
  }, []);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  if (loadingFirebase) { return <LoadingSpinner />; }
  if (error) { return <div className="error-container"><p className="error-message">{error}</p></div>; }

  const renderAdminContent = () => {
    switch (page) {
      case 'createEvent': return <CreateEventForm setPage={setPage} />;
      case 'eventList': return <EventList setPage={setPage} setSelectedEventId={setSelectedEventId} />;
      case 'manageEvent': return <ManageEventPage eventId={selectedEventId} setPage={setPage} />;
      case 'analytics': return <AnalyticsPage />;
      // The 'volunteers' case has been removed
      case 'dashboard':
      default:
        return <AdminWorkspace setPage={setPage} />;
    }
  };

  const renderPage = () => {
    if (page === 'about') { return <main className="fade-in" key={page}><AboutPage /></main>; }
    if (page === 'help') { return <main className="fade-in" key={page}><HelpPage /></main>; }

    if (userId) {
      if (userRole === 'admin') {
        return (
          <div className="admin-layout">
            <Sidebar page={page} setPage={setPage} />
            <main className="admin-content fade-in" key={page}>
              {renderAdminContent()}
            </main>
          </div>
        );
      } else if (userRole === 'volunteer') {
        return <main className="fade-in" key={page}><VolunteerDashboard /></main>;
      }
    }

    switch (page) {
      case 'login': return <main className="fade-in" key={page}><Auth isInitialLogin={true} /></main>;
      case 'register': return <main className="fade-in" key={page}><Auth isInitialLogin={false} /></main>;
      default: return <main className="fade-in" key={page}><LandingPage setPage={setPage} /></main>;
    }
  };

  return (
    <FirebaseContext.Provider value={{ auth, db, userId, userRole, userName }}>
      <div className="app-container">
        <Navbar setPage={setPage} userId={userId} userName={userName} handleLogout={handleLogout} />
        {renderPage()}
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
