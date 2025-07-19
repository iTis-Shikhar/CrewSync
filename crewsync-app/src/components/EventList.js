import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, onSnapshot, query } from "firebase/firestore";

// Component now gets navigation functions from App.js via props
function EventList({ setPage, setSelectedEventId }) {
  const { db } = useContext(FirebaseContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "events"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
      setLoading(false);
    }, (err) => {
      setError("Failed to fetch events.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  const handleManageClick = (eventId) => {
    setSelectedEventId(eventId);
    setPage('manageEvent');
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-content">
      <div className="list-header">
        <h3>Upcoming Events</h3>
        <button className="btn btn-secondary" onClick={() => setPage('dashboard')}>
          &larr; Back to Workspace
        </button>
      </div>
      {events.length === 0 ? (
        <p>No events found. Create your first one!</p>
      ) : (
        <ul className="event-list-ul">
          {events.map(event => (
            <li key={event.id} className="event-item-card">
              <h4>{event.name}</h4>
              <p className="event-date">{event.date}</p>
              <p className="event-description">{event.description}</p>
              <div className="event-actions">
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
