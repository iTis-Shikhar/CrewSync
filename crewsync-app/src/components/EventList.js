import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, onSnapshot, query, where, doc, deleteDoc, getDocs } from "firebase/firestore";

function EventList({ setPage, setSelectedEventId }) {
  const { db, userId } = useContext(FirebaseContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Effect to fetch ONLY the events created by the current admin
  useEffect(() => {
    if (!db || !userId) return;

    // UPDATED QUERY: Add a 'where' clause to filter by adminId
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

  // NEW: Function to delete an event and all its subcollections
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This will also delete all its shifts and volunteers. This action cannot be undone.")) {
      return;
    }
    try {
      // Delete all shifts in the subcollection
      const shiftsRef = collection(db, "events", eventId, "shifts");
      const shiftsSnap = await getDocs(shiftsRef);
      shiftsSnap.forEach(async (shiftDoc) => {
        await deleteDoc(doc(db, "events", eventId, "shifts", shiftDoc.id));
      });

      // Delete all volunteers in the subcollection
      const volunteersRef = collection(db, "events", eventId, "volunteers");
      const volunteersSnap = await getDocs(volunteersRef);
      volunteersSnap.forEach(async (volunteerDoc) => {
        await deleteDoc(doc(db, "events", eventId, "volunteers", volunteerDoc.id));
      });

      // Finally, delete the event itself
      await deleteDoc(doc(db, "events", eventId));

    } catch (err) {
      console.error("Error deleting event: ", err);
      alert("Failed to delete event.");
    }
  };

  const handleManageClick = (eventId) => {
    setSelectedEventId(eventId);
    setPage('manageEvent');
  };

  if (loading) return <p>Loading events...</p>;
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
        <p>You haven't created any events yet.</p>
      ) : (
        <ul className="event-list-ul">
          {events.map(event => (
            <li key={event.id} className="event-item-card">
              <h4>{event.name}</h4>
              <p className="event-date">{event.date}</p>
              <p className="event-description">{event.description}</p>
              <div className="event-actions">
                {/* NEW: Delete button */}
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
