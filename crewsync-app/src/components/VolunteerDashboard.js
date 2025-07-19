import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collectionGroup, query, where, onSnapshot, updateDoc } from "firebase/firestore";

function VolunteerDashboard() {
  const { db, userId } = useContext(FirebaseContext);
  const [myShifts, setMyShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db || !userId) return;
    const shiftsQuery = query(
      collectionGroup(db, 'shifts'), 
      where('assignedVolunteer', '==', userId)
    );
    const unsubscribe = onSnapshot(shiftsQuery, (querySnapshot) => {
      // The collectionGroup query gives us a special 'ref' property on each doc
      // which is a direct path to the document, perfect for updates!
      const shiftsData = querySnapshot.docs.map(doc => ({ id: doc.id, ref: doc.ref, ...doc.data() }));
      setMyShifts(shiftsData);
      setLoading(false);
    }, (err) => {
      setError("Could not load your schedule. Please try again later.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db, userId]);

  // NEW: Function for volunteer to check themselves in
  const handleCheckIn = async (shiftRef) => {
    try {
      await updateDoc(shiftRef, {
        attendanceStatus: 'checked-in'
      });
    } catch (err) {
      console.error("Check-in failed: ", err);
      alert("Could not check in. Please try again.");
    }
  };

  const renderStatus = (shift) => {
    switch (shift.attendanceStatus) {
      case 'confirmed':
        return <span className="status-confirmed">Present & Confirmed</span>;
      case 'checked-in':
        return <span className="status-pending">Awaiting Confirmation</span>;
      case 'unconfirmed':
      default:
        return <button className="btn btn-primary" onClick={() => handleCheckIn(shift.ref)}>Check-in</button>;
    }
  };

  return (
    <div className="page-content">
      <h1>My Schedule</h1>
      <p>Thank you for your commitment! Check-in for your shift when you arrive.</p>
      <hr className="divider" />
      <div className="my-shifts-list">
        {loading && <p>Loading your schedule...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && myShifts.length === 0 && <p>You have no assigned shifts yet.</p>}
        {myShifts.length > 0 && (
          <ul>
            {myShifts.map(shift => (
              <li key={shift.id} className="my-shift-item">
                <div className="my-shift-details">
                  <span className="my-shift-name">{shift.name}</span>
                  <span className="my-shift-time">{shift.startTime} - {shift.endTime}</span>
                </div>
                <div className="my-shift-status">
                  {renderStatus(shift)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default VolunteerDashboard;
