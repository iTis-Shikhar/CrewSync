import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App'; // We need to go up one directory to find App.js
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";

function EventManagement() {
  const { db } = useContext(FirebaseContext);

  // State for the form inputs
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  
  // State to hold the list of events from Firestore
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Effect to fetch events in real-time
  useEffect(() => {
    if (!db) return;

    const eventsCollectionRef = collection(db, "events");
    const q = query(eventsCollectionRef); // We can add sorting here later if needed

    // onSnapshot listens for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      setEvents(eventsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Check security rules and console for details.");
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [db]);


  // Handler for form submission
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!db) return;
    
    try {
      await addDoc(collection(db, "events"), {
        name: eventName,
        date: eventDate,
        description: eventDescription,
        createdAt: new Date() // Store a timestamp
      });
      // Clear the form fields after successful submission
      setEventName('');
      setEventDate('');
      setEventDescription('');
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to create event.");
    }
  };

  return (
    <div className="event-management-container">
      <div className="create-event-form">
        <h3>Create a New Event</h3>
        <form onSubmit={handleCreateEvent}>
          <div className="form-group">
            <label htmlFor="eventName">Event Name</label>
            <input type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="eventDate">Event Date</label>
            <input type="date" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="eventDescription">Description</label>
            <textarea id="eventDescription" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required />
          </div>
          <button type="submit" className="submit-button">Create Event</button>
        </form>
      </div>

      <div className="event-list">
        <h3>Current Events</h3>
        {loading && <p>Loading events...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && events.length === 0 && <p>No events found. Create your first one!</p>}
        <ul>
          {events.map(event => (
            <li key={event.id} className="event-item">
              <h4>{event.name}</h4>
              <p><strong>Date:</strong> {event.date}</p>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventManagement;
