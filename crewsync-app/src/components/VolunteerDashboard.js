import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collectionGroup, query, where, onSnapshot } from "firebase/firestore";

function VolunteerDashboard() {
  // Get the database instance and the current volunteer's user ID
  const { db, userId } = useContext(FirebaseContext);
  
  const [myShifts, setMyShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db || !userId) return;

    // This is a collection group query. It looks at ALL 'shifts' collections
    // across the entire database, no matter which event they are nested under.
    const shiftsQuery = query(
      collectionGroup(db, 'shifts'), 
      where('assignedVolunteer', '==', userId) // But it ONLY returns shifts where the assignedVolunteer field matches the current user's ID.
    );

    const unsubscribe = onSnapshot(shiftsQuery, (querySnapshot) => {
      const shiftsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyShifts(shiftsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching shifts: ", err);
      setError("Could not load your schedule. Please try again later.");
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();

  }, [db, userId]);


  return (
    <div className="page-content">
      <h1>My Schedule</h1>
      <p>
        Thank you for your commitment! Here are your assigned shifts and duties.
      </p>
      <hr className="divider" />
      
      <div className="my-shifts-list">
        {loading && <p>Loading your schedule...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && myShifts.length === 0 && (
          <p>You have no assigned shifts yet. Check back soon!</p>
        )}

        {myShifts.length > 0 && (
          <ul>
            {myShifts.map(shift => (
              <li key={shift.id} className="my-shift-item">
                <div className="my-shift-details">
                  <span className="my-shift-name">{shift.name}</span>
                  <span className="my-shift-time">{shift.startTime} - {shift.endTime}</span>
                  {/* We can add the event name here in the future if we store it on the shift */}
                </div>
                <div className="my-shift-status">
                  {/* We will add attendance marking here in the final phase */}
                  <span>Confirmed</span>
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
