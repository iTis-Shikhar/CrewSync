import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, addDoc } from "firebase/firestore";

function CreateEventForm({ setPage }) {
  const { db, userId } = useContext(FirebaseContext);
  
  const [eventName, setEventName] = useState('');
  // NEW: State for start and end dates
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!db || !userId) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await addDoc(collection(db, "events"), {
        name: eventName, 
        // Save both dates
        startDate: startDate, 
        endDate: endDate,
        description: eventDescription, 
        createdAt: new Date(),
        adminId: userId
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
          <div className="form-group">
            <label htmlFor="eventName">Event Name</label>
            <input type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
          </div>
          
          {/* NEW: Date range inputs */}
          <div className="date-range-group">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="eventDescription">Description</label>
            {/* NEW: rows="3" attribute sets the initial height */}
            <textarea id="eventDescription" rows="3" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required />
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
