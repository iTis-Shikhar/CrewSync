import React from 'react';
import EventManagement from './EventManagement'; // Import the new component

function AdminDashboard() {
  return (
    <div className="page-content">
      <h1>Admin Dashboard</h1>
      <p>
        Welcome, Event Organizer! Use the form below to create and manage your events.
      </p>
      <hr className="divider" />
      {/* Render the EventManagement component here */}
      <EventManagement />
    </div>
  );
}

export default AdminDashboard;
