import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import LoadingSpinner from './LoadingSpinner';

function VolunteerManagementPage() {
  const { db } = useContext(FirebaseContext);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "users"), where("role", "==", "volunteer"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const volunteersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVolunteers(volunteersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-content">
      <h1>Volunteer Directory</h1>
      <p>A central list of all registered volunteers in your system.</p>
      <hr className="divider" />
      <div className="volunteer-table-container">
        <table className="volunteer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Skills / Interests</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map(v => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.email}</td>
                <td>{v.skills}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VolunteerManagementPage;
