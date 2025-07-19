import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, addDoc } from "firebase/firestore";

function CreateEventForm({ setPage }) {
  // Get the database instance AND the current user's ID from context
  const { db, userId } = useContext(FirebaseContext);
  
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!db || !userId) return; // Make sure we have the userId
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await addDoc(collection(db, "events"), {
        name: eventName, 
        date: eventDate, 
        description: eventDescription, 
        createdAt: new Date(),
        adminId: userId // <-- THE CRUCIAL CHANGE: Tag the event with the creator's ID
      });
      setPage('eventList');
    } catch (err) {
      setError("Failed to create event. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <div className="form-container">
        <h3>New Event Details</h3>
        <form onSubmit={handleCreateEvent}>
          {/* Form inputs remain the same */}
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
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="button" onClick={() => setPage('dashboard')} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventForm;
