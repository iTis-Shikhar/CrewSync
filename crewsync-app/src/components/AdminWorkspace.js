import React from 'react';

// This component is the main view with the two action cards.
// It receives `setPage` from App.js to handle navigation.
function AdminWorkspace({ setPage }) {
  return (
    <div className="page-content">
      <h1>Organizer's Workspace</h1>
      <p>Welcome back! Let's get your event organized.</p>
      <hr className="divider" />
      <div className="dashboard-actions">
        <div className="action-card" onClick={() => setPage('createEvent')}>
          <div className="action-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </div>
          <h3>Create New Event</h3>
          <p>Start here to set up a new event, define its details, and get ready for volunteers.</p>
        </div>
        <div className="action-card" onClick={() => setPage('eventList')}>
          <div className="action-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>
          </div>
          <h3>View All Events</h3>
          <p>View all your scheduled events, manage shifts, assign volunteers, and track progress.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminWorkspace;
