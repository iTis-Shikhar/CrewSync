import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { doc, getDoc } from "firebase/firestore";

// This component receives the eventId and the setPage function from App.js
function ManageEventPage({ eventId, setPage }) {
  const { db } = useContext(FirebaseContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect to fetch the specific event document from Firestore
  useEffect(() => {
    if (!db || !eventId) return;

    const getEventData = async () => {
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError("Event not found.");
      }
      setLoading(false);
    };

    getEventData();
  }, [db, eventId]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-content">
      <div className="list-header">
        {/* Display the event name in the header */}
        <h1>Manage: {event?.name}</h1>
        <button className="btn btn-secondary" onClick={() => setPage('eventList')}>
          &larr; Back to Event List
        </button>
      </div>
      <p className="event-date">Date: {event?.date}</p>
      <p>{event?.description}</p>

      <hr className="divider" />

      {/* This is where we will add the volunteer management features next */}
      <div className="management-section">
        <h3>Volunteer Roster</h3>
        <p>This area will soon allow you to add and manage volunteers for this specific event.</p>
      </div>
    </div>
  );
}

export default ManageEventPage;
