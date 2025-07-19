import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { doc, getDoc, collection, addDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";

function ManageEventPage({ eventId, setPage }) {
  const { db } = useContext(FirebaseContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the volunteer roster
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [roster, setRoster] = useState([]);
  const [addVolunteerError, setAddVolunteerError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Fetch the main event data
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

  // Fetch the volunteer roster for this event in real-time
  useEffect(() => {
    if (!db || !eventId) return;
    const rosterCollectionRef = collection(db, "events", eventId, "volunteers");
    const q = query(rosterCollectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rosterData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRoster(rosterData);
    });
    return () => unsubscribe();
  }, [db, eventId]);


  const handleAddVolunteer = async (e) => {
    e.preventDefault();
    if (!db || !volunteerEmail) return;

    setIsAdding(true);
    setAddVolunteerError('');

    try {
      // 1. Find the user in the main 'users' collection by their email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", volunteerEmail), where("role", "==", "volunteer"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No volunteer found with this email, or user is not registered as a volunteer.");
      }

      // 2. Add the found volunteer to this event's 'volunteers' subcollection
      const volunteerData = querySnapshot.docs[0].data();
      const volunteerId = querySnapshot.docs[0].id;

      const rosterCollectionRef = collection(db, "events", eventId, "volunteers");
      await addDoc(rosterCollectionRef, {
        uid: volunteerId,
        email: volunteerData.email
      });

      setVolunteerEmail(''); // Clear input on success

    } catch (err) {
      setAddVolunteerError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-content">
      <div className="list-header">
        <h1>Manage: {event?.name}</h1>
        <button className="btn btn-secondary" onClick={() => setPage('eventList')}>
          &larr; Back to Event List
        </button>
      </div>
      <p className="event-date">Date: {event?.date}</p>
      <p>{event?.description}</p>
      <hr className="divider" />

      <div className="management-section">
        <h3>Volunteer Roster</h3>
        <div className="roster-container">
          {/* Form to add volunteers */}
          <div className="add-volunteer-form">
            <h4>Add Volunteer to Roster</h4>
            <form onSubmit={handleAddVolunteer}>
              <p>Enter the email of a registered volunteer to add them to this event.</p>
              <div className="form-group">
                <label htmlFor="volunteerEmail">Volunteer Email</label>
                <input 
                  type="email" 
                  id="volunteerEmail" 
                  value={volunteerEmail} 
                  onChange={(e) => setVolunteerEmail(e.target.value)} 
                  placeholder="volunteer@example.com"
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add Volunteer'}
              </button>
              {addVolunteerError && <p className="error-message">{addVolunteerError}</p>}
            </form>
          </div>
          {/* List of current volunteers */}
          <div className="roster-list">
            <h4>Current Roster ({roster.length})</h4>
            {roster.length > 0 ? (
              <ul>
                {roster.map(volunteer => (
                  <li key={volunteer.id} className="roster-item">
                    <span>{volunteer.email}</span>
                    {/* We can add a 'Remove' button here later */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No volunteers have been added to this event yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageEventPage;
