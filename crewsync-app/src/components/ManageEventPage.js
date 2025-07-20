import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { doc, getDoc, collection, query, onSnapshot, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import ShiftManagement from './ShiftManagement';
import Announcements from './Announcements';
import VolunteerSelector from './VolunteerSelector';

function ManageEventPage({ eventId, setPage }) {
  const { db } = useContext(FirebaseContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roster, setRoster] = useState([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    if (!db || !eventId) return;
    const docRef = doc(db, "events", eventId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError("Event not found.");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db, eventId]);

  useEffect(() => {
    if (!db || !eventId) return;
    const rosterCollectionRef = collection(db, "events", eventId, "volunteers");
    const unsubscribe = onSnapshot(query(rosterCollectionRef), (querySnapshot) => {
      setRoster(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [db, eventId]);

  // handleAddSelected is now inside VolunteerSelector, this page doesn't need it.

  const handleRemoveVolunteer = async (volunteerDocId, volunteerUid) => {
    // 1. Remove the volunteer from the subcollection
    await deleteDoc(doc(db, "events", eventId, "volunteers", volunteerDocId));
    
    // 2. Remove the volunteer's UID from the master list on the event document
    const eventDocRef = doc(db, "events", eventId);
    await updateDoc(eventDocRef, {
      volunteerUids: arrayRemove(volunteerUid)
    });
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      {isSelectorOpen && (
        <VolunteerSelector 
          eventId={eventId} 
          roster={roster} 
          onClose={() => setIsSelectorOpen(false)} 
        />
      )}
      <div className="page-content">
        <div className="list-header">
          <h1>Manage: {event?.name}</h1>
          <button className="btn btn-secondary" onClick={() => setPage('eventList')}>&larr; Back to Event List</button>
        </div>
        <p className="event-date">Date: {event?.startDate} {event?.endDate && `to ${event?.endDate}`}</p>
        <p>{event?.description}</p>
        <hr className="divider" />
        <Announcements eventId={eventId} />
        <hr className="divider" />
        <div className="management-section">
          <h3>Volunteer Roster</h3>
          <div className="roster-container">
            <div className="add-volunteer-box">
              <h4>Add Volunteers</h4>
              <p>Select from the directory to add multiple volunteers to this event's roster at once.</p>
              <button className="btn btn-primary" onClick={() => setIsSelectorOpen(true)}>Add from Directory</button>
            </div>
            <div className="roster-list">
              <h4>Current Roster ({roster.length})</h4>
              {roster.length > 0 ? (
                <ul>
                  {roster.map(volunteer => (
                    <li key={volunteer.id} className="roster-item">
                      <span>{volunteer.email}</span>
                      <button className="btn-remove" onClick={() => handleRemoveVolunteer(volunteer.id, volunteer.uid)}>×</button>
                    </li>
                  ))}
                </ul>
              ) : (<p>No volunteers have been added to this event yet.</p>)}
            </div>
          </div>
        </div>
        <hr className="divider" />
        <ShiftManagement eventId={eventId} roster={roster} />
      </div>
    </>
  );
}

export default ManageEventPage;
