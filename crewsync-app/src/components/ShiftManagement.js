import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

function ShiftManagement({ eventId, roster }) {
  const { db } = useContext(FirebaseContext);
  const [shiftName, setShiftName] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentState, setAssignmentState] = useState({});
  const [allVolunteers, setAllVolunteers] = useState([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "users"), where("role", "==", "volunteer"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setAllVolunteers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!db || !eventId) return;
    const q = query(collection(db, "events", eventId, "shifts"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setShifts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db, eventId]);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    if (!db) return;
    try {
      await addDoc(collection(db, "events", eventId, "shifts"), {
        name: shiftName, date: shiftDate, startTime, endTime, 
        assignedVolunteer: null, assignedVolunteerEmail: null, assignedVolunteerName: null,
        attendanceStatus: 'unconfirmed', eventId: eventId
      });
      setShiftName(''); setShiftDate(''); setStartTime(''); setEndTime('');
    } catch (err) { console.error("Error creating shift: ", err); }
  };

  const handleSelectionChange = (shiftId, volunteerId) => {
    setAssignmentState(prevState => ({ ...prevState, [shiftId]: volunteerId }));
  };

  const handleAssignVolunteer = async (shiftId) => {
    const volunteerId = assignmentState[shiftId];
    if (!volunteerId) { alert("Please select a volunteer from the dropdown first."); return; }
    const volunteer = allVolunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;
    const shiftDocRef = doc(db, "events", eventId, "shifts", shiftId);
    await updateDoc(shiftDocRef, {
      assignedVolunteer: volunteer.uid, 
      assignedVolunteerEmail: volunteer.email,
      assignedVolunteerName: volunteer.name
    });
  };

  const handleDeleteShift = async (shiftId) => {
    await deleteDoc(doc(db, "events", eventId, "shifts", shiftId));
  };

  const handleConfirmAttendance = async (shift) => {
    try {
      await setDoc(doc(db, "workHistory", shift.id), {
        ...shift,
        attendanceStatus: 'confirmed'
      });
      await deleteDoc(doc(db, "events", eventId, "shifts", shift.id));
    } catch (err) {
      console.error("Error confirming attendance: ", err);
      alert("Failed to confirm attendance.");
    }
  };

  const renderAssignment = (shift) => {
    if (shift.attendanceStatus === 'checked-in') {
      return <button className="btn btn-confirm" onClick={() => handleConfirmAttendance(shift)}>Confirm Presence</button>;
    }
    if (shift.assignedVolunteer) {
      return <span className="assigned-volunteer">{shift.assignedVolunteerName || shift.assignedVolunteerEmail}</span>;
    }
    return (
      <div className="assign-controls">
        <select className="role-select" onChange={(e) => handleSelectionChange(shift.id, e.target.value)}>
          <option value="">Assign a volunteer...</option>
          {allVolunteers.filter(v => roster.some(r => r.uid === v.id)).map(v => <option key={v.uid} value={v.uid}>{v.name} ({v.email})</option>)}
        </select>
        <button className="btn btn-secondary" onClick={() => handleAssignVolunteer(shift.id)}>Assign</button>
      </div>
    );
  };

  return (
    <div className="management-section">
      <h3>Shift & Schedule Management</h3>
      <div className="shift-container">
        <div className="create-shift-form">
          <h4>Create New Shift</h4>
          <form onSubmit={handleCreateShift}>
            <div className="form-group">
              <label htmlFor="shiftName">Shift Name / Duty</label>
              <input type="text" id="shiftName" value={shiftName} onChange={(e) => setShiftName(e.target.value)} required placeholder="e.g., Registration Desk" />
            </div>
            <div className="form-group">
              <label htmlFor="shiftDate">Date</label>
              <input type="date" id="shiftDate" value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Create Shift</button>
          </form>
        </div>
        <div className="shift-list">
          <h4>Scheduled Shifts ({shifts.length})</h4>
          {loading ? <LoadingSpinner /> : shifts.length > 0 ? (
            <ul>
              {shifts.map(shift => (
                <li key={shift.id} className="shift-item-card">
                  <div className="shift-details">
                    <span className="shift-name">{shift.name}</span>
                    <span className="shift-time">{shift.date} &bull; {shift.startTime} - {shift.endTime}</span>
                  </div>
                  <div className="shift-actions">
                    <div className="shift-assignment">
                      {renderAssignment(shift)}
                    </div>
                    <button className="btn-remove" onClick={() => handleDeleteShift(shift.id)}>×</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.25 2.25 0 015.636 5.636m0 0A2.25 2.25 0 015.25 6H9m6 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V6m-6 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V6" /></svg>}
              message="No shifts created yet."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ShiftManagement;
