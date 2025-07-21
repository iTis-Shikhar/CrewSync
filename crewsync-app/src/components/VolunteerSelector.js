import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import LoadingSpinner from './LoadingSpinner';

function VolunteerSelector({ eventId, roster, onClose }) {
  const { db } = useContext(FirebaseContext);
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "users"), where("role", "==", "volunteer"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setAllVolunteers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  const filteredVolunteers = allVolunteers
    .filter(v => !roster.some(r => r.uid === v.id))
    .filter(v => 
      (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (v.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelect = (volunteerId) => {
    setSelected(prev => ({ ...prev, [volunteerId]: !prev[volunteerId] }));
  };

  const handleAddSelected = async () => {
    setIsAdding(true);
    const selectedIds = Object.keys(selected).filter(id => selected[id]);
    if (selectedIds.length === 0) {
      setIsAdding(false);
      return;
    }

    // 1. Add each volunteer to the subcollection
    const rosterCollectionRef = collection(db, "events", eventId, "volunteers");
    const addPromises = selectedIds.map(id => {
      const volunteer = allVolunteers.find(v => v.id === id);
      return addDoc(rosterCollectionRef, {
        uid: volunteer.id,
        email: volunteer.email
      });
    });
    await Promise.all(addPromises);

    // 2. Atomically add all their UIDs to the master list on the event document
    const eventDocRef = doc(db, "events", eventId);
    await updateDoc(eventDocRef, {
      volunteerUids: arrayUnion(...selectedIds)
    });
    
    setIsAdding(false);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Volunteers from Directory</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <input type="text" className="search-input" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="volunteer-select-list">
            {loading ? <LoadingSpinner /> : (
              filteredVolunteers.map(volunteer => (
                <div key={volunteer.id} className="volunteer-select-item">
                  <input type="checkbox" id={volunteer.id} checked={!!selected[volunteer.id]} onChange={() => handleSelect(volunteer.id)} />
                  <label htmlFor={volunteer.id}>
                    <span className="volunteer-name">{volunteer.name || 'No Name Provided'}</span>
                    <span className="volunteer-email">{volunteer.email}</span>
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAddSelected} disabled={isAdding}>
            {isAdding ? 'Adding...' : `Add ${Object.values(selected).filter(Boolean).length} Volunteers`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VolunteerSelector;
