import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// This component is for the admin to send announcements for a specific event
function Announcements({ eventId }) {
  const { db, userName } = useContext(FirebaseContext);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!db || !message.trim()) return;

    setIsSending(true);
    try {
      const announcementsRef = collection(db, "events", eventId, "announcements");
      await addDoc(announcementsRef, {
        text: message,
        sentBy: userName || 'Admin', // Use the admin's name
        createdAt: serverTimestamp() // Use the server's timestamp for accuracy
      });
      setMessage(''); // Clear the input field
    } catch (err) {
      console.error("Error sending announcement: ", err);
      alert("Failed to send announcement.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="management-section">
      <h3>Send Announcement</h3>
      <div className="announcement-form-container">
        <p>Send a real-time message to all volunteers on this event's roster.</p>
        <form onSubmit={handleSendAnnouncement}>
          <div className="form-group">
            <label htmlFor="announcementMessage">Message</label>
            <textarea 
              id="announcementMessage" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="e.g., All volunteers for the morning shift, please meet at the main stage."
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send to All Volunteers'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Announcements;
