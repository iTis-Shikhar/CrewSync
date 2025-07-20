import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FirebaseContext } from '../App';
import { collectionGroup, query, where, onSnapshot, updateDoc } from "firebase/firestore";
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import Badges from './Badges';

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
      const shiftsData = querySnapshot.docs.map(doc => ({ id: doc.id, ref: doc.ref, ...doc.data() }));
      setMyShifts(shiftsData);
      setLoading(false);
    }, (err) => {
      setError("Could not load your schedule. Please try again later.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db, userId]);

  const earnedBadges = useMemo(() => {
    const badges = [];
    const confirmedShifts = myShifts.filter(s => s.attendanceStatus === 'confirmed');
    if (confirmedShifts.length > 0) {
      badges.push('firstShift');
    }
    const checkedInShifts = myShifts.filter(s => s.attendanceStatus === 'checked-in');
    if (confirmedShifts.length > 0 && checkedInShifts.length === 0) {
      badges.push('punctualPro');
    }
    return badges;
  }, [myShifts]);

  // --- THIS IS THE LOGIC THAT WAS MISSING ---
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
  // --- END OF MISSING LOGIC ---

  return (
    <div className="page-content">
      <h1>My Dashboard</h1>
      <p>Thank you for your commitment! Here are your achievements and assigned shifts.</p>
      
      <Badges earnedBadges={earnedBadges} />

      <hr className="divider" />
      
      <div className="my-shifts-list">
        <h3>My Upcoming Shifts</h3>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : myShifts.length === 0 ? (
          <EmptyState 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>}
            message="You have no assigned shifts yet."
          />
        ) : (
          <ul>
            {myShifts.map(shift => (
              <li key={shift.id} className="my-shift-item">
                <div className="my-shift-details">
                  <span className="my-shift-name">{shift.name}</span>
                  <span className="my-shift-time">{shift.startTime} - {shift.endTime}</span>
                </div>
                <div className="my-shift-status">
                  {/* This call now works correctly because the function exists */}
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
