import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, onSnapshot, query, where, doc, deleteDoc, getDocs } from "firebase/firestore";
import LoadingSpinner from './LoadingSpinner'; // Import spinner
import EmptyState from './EmptyState'; // Import empty state

function EventList({ setPage, setSelectedEventId }) {
  const { db, userId } = useContext(FirebaseContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db || !userId) return;
    const q = query(collection(db, "events"), where("adminId", "==", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
      setLoading(false);
    }, (err) => {
      setError("Failed to fetch events.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db, userId]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This will also delete all its shifts and volunteers. This action cannot be undone.")) return;
    try {
      const shiftsRef = collection(db, "events", eventId, "shifts");
      const shiftsSnap = await getDocs(shiftsRef);
      shiftsSnap.forEach(async (shiftDoc) => {
        await deleteDoc(doc(db, "events", eventId, "shifts", shiftDoc.id));
      });
      const volunteersRef = collection(db, "events", eventId, "volunteers");
      const volunteersSnap = await getDocs(volunteersRef);
      volunteersSnap.forEach(async (volunteerDoc) => {
        await deleteDoc(doc(db, "events", eventId, "volunteers", volunteerDoc.id));
      });
      await deleteDoc(doc(db, "events", eventId));
    } catch (err) {
      alert("Failed to delete event.");
    }
  };

  const handleManageClick = (eventId) => {
    setSelectedEventId(eventId);
    setPage('manageEvent');
  };

  // Use the spinner while loading
  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-content">
      <div className="list-header">
        <h3>Your Events</h3>
        <button className="btn btn-secondary" onClick={() => setPage('dashboard')}>
          &larr; Back to Workspace
        </button>
      </div>
      {events.length === 0 ? (
        // Use the new EmptyState component
        <EmptyState 
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          message="You haven't created any events yet."
        />
      ) : (
        <ul className="event-list-ul">
          {events.map(event => (
            <li key={event.id} className="event-item-card">
              <h4>{event.name}</h4>
              <p className="event-date">{event.date}</p>
              <p className="event-description">{event.description}</p>
              <div className="event-actions">
                <button className="btn btn-danger" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                <button className="btn btn-primary" onClick={() => handleManageClick(event.id)}>Manage</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventList;
