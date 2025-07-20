import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { doc, getDoc, collection, addDoc, query, where, getDocs, onSnapshot, deleteDoc } from "firebase/firestore";
import ShiftManagement from './ShiftManagement';
import Announcements from './Announcements'; // Import the new component

function ManageEventPage({ eventId, setPage }) {
  const { db } = useContext(FirebaseContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roster, setRoster] = useState([]);
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [addVolunteerError, setAddVolunteerError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!db || !eventId) return;
    const getEventData = async () => {
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) { setEvent({ id: docSnap.id, ...docSnap.data() }); } 
      else { setError("Event not found."); }
      setLoading(false);
    };
    getEventData();
  }, [db, eventId]);

  useEffect(() => {
    if (!db || !eventId) return;
    const rosterCollectionRef = collection(db, "events", eventId, "volunteers");
    const unsubscribe = onSnapshot(query(rosterCollectionRef), (querySnapshot) => {
      setRoster(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [db, eventId]);

  const handleAddVolunteer = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setAddVolunteerError('');
    try {
      const q = query(collection(db, "users"), where("email", "==", volunteerEmail), where("role", "==", "volunteer"));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) throw new Error("No volunteer found with this email.");
      const volunteerData = querySnapshot.docs[0].data();
      const volunteerId = querySnapshot.docs[0].id;
      await addDoc(collection(db, "events", eventId, "volunteers"), { uid: volunteerId, email: volunteerData.email });
      setVolunteerEmail('');
    } catch (err) {
      setAddVolunteerError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveVolunteer = async (volunteerDocId) => {
    await deleteDoc(doc(db, "events", eventId, "volunteers", volunteerDocId));
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-content">
      <div className="list-header">
        <h1>Manage: {event?.name}</h1>
        <button className="btn btn-secondary" onClick={() => setPage('eventList')}>&larr; Back to Event List</button>
      </div>
      <p className="event-date">Date: {event?.date}</p>
      <p>{event?.description}</p>
      
      {/* The new Announcements component is added here */}
      <hr className="divider" />
      <Announcements eventId={eventId} />

      <hr className="divider" />
      <div className="management-section">
        <h3>Volunteer Roster</h3>
        <div className="roster-container">
          <div className="add-volunteer-form">
            <h4>Add Volunteer to Roster</h4>
            <form onSubmit={handleAddVolunteer}>
              <p>Enter the email of a registered volunteer to add them to this event.</p>
              <div className="form-group">
                <label htmlFor="volunteerEmail">Volunteer Email</label>
                <input type="email" id="volunteerEmail" value={volunteerEmail} onChange={(e) => setVolunteerEmail(e.target.value)} placeholder="volunteer@example.com" required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isAdding}>{isAdding ? 'Adding...' : 'Add Volunteer'}</button>
              {addVolunteerError && <p className="error-message">{addVolunteerError}</p>}
            </form>
          </div>
          <div className="roster-list">
            <h4>Current Roster ({roster.length})</h4>
            {roster.length > 0 ? (
              <ul>
                {roster.map(volunteer => (<li key={volunteer.id} className="roster-item"><span>{volunteer.email}</span><button className="btn-remove" onClick={() => handleRemoveVolunteer(volunteer.id)}>×</button></li>))}
              </ul>
            ) : (<p>No volunteers have been added to this event yet.</p>)}
          </div>
        </div>
      </div>
      <hr className="divider" />
      <ShiftManagement eventId={eventId} roster={roster} />
    </div>
  );
}

export default ManageEventPage;
