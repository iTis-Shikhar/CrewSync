import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../App';
import { collection, query, where, getDocs } from "firebase/firestore";
import LoadingSpinner from './LoadingSpinner';

function AnalyticsPage() {
  const { db, userId } = useContext(FirebaseContext);

  // State to hold our calculated stats
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db || !userId) return;

    const fetchAnalyticsData = async () => {
      try {
        // 1. Fetch all events created by this admin
        const eventsQuery = query(collection(db, "events"), where("adminId", "==", userId));
        const eventsSnapshot = await getDocs(eventsQuery);
        const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        let totalShifts = 0;
        let assignedShifts = 0;
        let confirmedAttendance = 0;

        // 2. Loop through each event to fetch its shifts
        for (const event of events) {
          const shiftsQuery = query(collection(db, "events", event.id, "shifts"));
          const shiftsSnapshot = await getDocs(shiftsQuery);
          
          shiftsSnapshot.forEach(doc => {
            const shift = doc.data();
            totalShifts++;
            if (shift.assignedVolunteer) {
              assignedShifts++;
            }
            if (shift.attendanceStatus === 'confirmed') {
              confirmedAttendance++;
            }
          });
        }

        // 3. Calculate the final stats
        const shiftCoverage = totalShifts > 0 ? (assignedShifts / totalShifts) * 100 : 0;
        const attendanceRate = assignedShifts > 0 ? (confirmedAttendance / assignedShifts) * 100 : 0;

        setStats({
          totalEvents: events.length,
          totalShifts,
          assignedShifts,
          confirmedAttendance,
          shiftCoverage: shiftCoverage.toFixed(0),
          attendanceRate: attendanceRate.toFixed(0)
        });

      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Could not load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [db, userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-content">
      <h1>Event Analytics</h1>
      <p>An overview of your operational performance across all events.</p>
      <hr className="divider" />

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.totalEvents}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalShifts}</span>
          <span className="stat-label">Total Shifts Created</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.shiftCoverage}%</span>
          <span className="stat-label">Shift Coverage</span>
          <small>({stats.assignedShifts} of {stats.totalShifts} shifts assigned)</small>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.attendanceRate}%</span>
          <span className="stat-label">Volunteer Attendance Rate</span>
          <small>({stats.confirmedAttendance} of {stats.assignedShifts} assigned volunteers attended)</small>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
