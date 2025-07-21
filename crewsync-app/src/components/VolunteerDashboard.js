import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FirebaseContext } from '../App';
import { collection, collectionGroup, query, where, onSnapshot, updateDoc, orderBy } from "firebase/firestore";
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import Badges from './Badges';

function VolunteerDashboard() {
  const { db, userId, userName } = useContext(FirebaseContext);
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [pastShifts, setPastShifts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch upcoming shifts
  useEffect(() => {
    if (!db || !userId) return;
    const shiftsQuery = query(collectionGroup(db, 'shifts'), where('assignedVolunteer', '==', userId));
    const unsubscribeShifts = onSnapshot(shiftsQuery, (querySnapshot) => {
      const shiftsData = querySnapshot.docs.map(doc => ({ id: doc.id, ref: doc.ref, ...doc.data() }));
      setUpcomingShifts(shiftsData);
      setLoading(false);
    });
    return () => unsubscribeShifts();
  }, [db, userId]);

  // Fetch past shifts from workHistory
  useEffect(() => {
    if (!db || !userId) return;
    const historyQuery = query(collection(db, 'workHistory'), where('assignedVolunteer', '==', userId));
    const unsubscribeHistory = onSnapshot(historyQuery, (querySnapshot) => {
      const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPastShifts(historyData);
    });
    return () => unsubscribeHistory;
  }, [db, userId]);

  // Fetch announcements
  useEffect(() => {
    if (upcomingShifts.length === 0) {
      setAnnouncements([]);
      return;
    };
    const eventIds = [...new Set(upcomingShifts.map(shift => shift.ref.parent.parent.id))];
    let allAnnouncements = {};
    const unsubscribers = eventIds.map(eventId => {
      const announcementsQuery = query(collection(db, 'events', eventId, 'announcements'), orderBy('createdAt', 'desc'));
      return onSnapshot(announcementsQuery, (querySnapshot) => {
        querySnapshot.forEach(doc => { allAnnouncements[doc.id] = { id: doc.id, ...doc.data() }; });
        const sortedAnnouncements = Object.values(allAnnouncements).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setAnnouncements(sortedAnnouncements);
      });
    });
    return () => unsubscribers.forEach(unsub => unsub());
  }, [db, upcomingShifts]);

  const earnedBadges = useMemo(() => {
    if (!pastShifts) return []; 
    const badges = [];
    if (pastShifts.length > 0) { badges.push('firstShift'); }
    if (pastShifts.length > 0 && upcomingShifts.filter(s => s.attendanceStatus === 'checked-in').length === 0) {
      badges.push('punctualPro');
    }
    return badges;
  }, [pastShifts, upcomingShifts]);

  const handleCheckIn = async (shiftRef) => {
    try { await updateDoc(shiftRef, { attendanceStatus: 'checked-in', assignedVolunteerName: userName }); } 
    catch (err) { alert("Could not check in."); }
  };

  const renderStatus = (shift) => {
    switch (shift.attendanceStatus) {
      case 'checked-in': return <span className="status-pending">Awaiting Confirmation</span>;
      default: return <button className="btn btn-primary" onClick={() => handleCheckIn(shift.ref)}>Check-in</button>;
    }
  };

  return (
    <div className="page-content">
      <h1>My Dashboard</h1>
      <p>Thank you for your commitment! Here are your achievements, announcements, and schedule.</p>
      
      {/* THIS IS THE CORRECTED ANNOUNCEMENT FEED */}
      {announcements.length > 0 && (
        <div className="announcement-feed">
          <h3>Recent Announcements</h3>
          <div className="announcement-list">
            {announcements.map(announcement => (
              <div key={announcement.id} className="announcement-item">
                <p className="announcement-text">{announcement.text}</p>
                <span className="announcement-meta">
                  Sent by {announcement.sentBy} at {announcement.createdAt ? new Date(announcement.createdAt.toDate()).toLocaleTimeString() : '...'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Badges earnedBadges={earnedBadges} />
      <hr className="divider" />
      <div className="my-shifts-container">
        <div className="my-shifts-list">
          <h3>My Upcoming Shifts</h3>
          {loading ? <LoadingSpinner />
           : error ? <p className="error-message">{error}</p>
           : upcomingShifts.length === 0 ? (
            <EmptyState 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>}
              message="You have no upcoming shifts."
            />
          ) : (
            <ul>
              {upcomingShifts.map(shift => (
                <li key={shift.id} className="my-shift-item">
                  <div className="my-shift-details">
                    <span className="my-shift-name">{shift.name}</span>
                    <span className="my-shift-time">{shift.date} &bull; {shift.startTime} - {shift.endTime}</span>
                  </div>
                  <div className="my-shift-status">{renderStatus(shift)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="my-shifts-list">
          <h3>Past Shifts (Permanent Record)</h3>
          {pastShifts.length === 0 ? (
            <p>Your completed work history will appear here.</p>
          ) : (
            <ul>
              {pastShifts.map(shift => (
                <li key={shift.id} className="my-shift-item past-shift">
                  <div className="my-shift-details">
                    <span className="my-shift-name">{shift.name}</span>
                    <span className="my-shift-time">{shift.date} &bull; {shift.startTime} - {shift.endTime}</span>
                  </div>
                  <div className="my-shift-status">
                    <span className="status-confirmed">Completed</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default VolunteerDashboard;
