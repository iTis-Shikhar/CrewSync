import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from "firebase/firestore";

function ShiftManagement({ eventId, roster }) {
  const { db } = useContext(FirebaseContext);
  const [shiftName, setShiftName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentState, setAssignmentState] = useState({});

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
        name: shiftName, startTime, endTime, assignedVolunteer: null, assignedVolunteerEmail: null,
        attendanceStatus: 'unconfirmed'
      });
      setShiftName(''); setStartTime(''); setEndTime('');
    } catch (err) { console.error("Error creating shift: ", err); }
  };

  const handleSelectionChange = (shiftId, volunteerId) => {
    setAssignmentState(prevState => ({ ...prevState, [shiftId]: volunteerId }));
  };

  const handleAssignVolunteer = async (shiftId) => {
    const volunteerId = assignmentState[shiftId];
    if (!volunteerId) return;
    const volunteer = roster.find(v => v.uid === volunteerId);
    if (!volunteer) return;
    const shiftDocRef = doc(db, "events", eventId, "shifts", shiftId);
    await updateDoc(shiftDocRef, {
      assignedVolunteer: volunteer.uid, assignedVolunteerEmail: volunteer.email
    });
  };

  const handleDeleteShift = async (shiftId) => {
    await deleteDoc(doc(db, "events", eventId, "shifts", shiftId));
  };

  const handleConfirmAttendance = async (shiftId) => {
    const shiftDocRef = doc(db, "events", eventId, "shifts", shiftId);
    await updateDoc(shiftDocRef, {
      attendanceStatus: 'confirmed'
    });
  };

  const renderAssignment = (shift) => {
    if (shift.attendanceStatus === 'checked-in') {
      return <button className="btn btn-confirm" onClick={() => handleConfirmAttendance(shift.id)}>Confirm Presence</button>;
    }
    if (shift.attendanceStatus === 'confirmed') {
      return <span className="status-confirmed">Confirmed</span>;
    }
    if (shift.assignedVolunteer) {
      return <span className="assigned-volunteer">{shift.assignedVolunteerEmail}</span>;
    }
    return (
      <div className="assign-controls">
        <select className="role-select" onChange={(e) => handleSelectionChange(shift.id, e.target.value)}>
          <option value="">Assign a volunteer...</option>
          {roster.map(v => <option key={v.uid} value={v.uid}>{v.email}</option>)}
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
          {/* THIS IS THE FORM THAT WAS MISSING */}
          <form onSubmit={handleCreateShift}>
            <div className="form-group">
              <label htmlFor="shiftName">Shift Name / Duty</label>
              <input type="text" id="shiftName" value={shiftName} onChange={(e) => setShiftName(e.target.value)} required placeholder="e.g., Registration Desk" />
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
          {loading && <p>Loading shifts...</p>}
          {!loading && shifts.length > 0 ? (
            <ul>
              {shifts.map(shift => (
                <li key={shift.id} className="shift-item">
                  <div className="shift-details">
                    <span className="shift-name">{shift.name}</span>
                    <span className="shift-time">{shift.startTime} - {shift.endTime}</span>
                  </div>
                  <div className="shift-assignment">
                    {renderAssignment(shift)}
                  </div>
                  <button className="btn-remove" onClick={() => handleDeleteShift(shift.id)}>×</button>
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p>No shifts created for this event yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShiftManagement;
