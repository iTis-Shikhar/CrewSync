import React from 'react';

// This is the dashboard for Event Organizers (Admins)
function AdminDashboard() {
  return (
    <div className="page-content">
      <h1>Admin Dashboard</h1>
      <p>
        Welcome, Event Organizer! You have full access to manage this event.
      </p>
      
      <h3>Next Steps:</h3>
      <ul>
        <li>Build the "Create Event" form.</li>
        <li>Display a list of all current events.</li>
        <li>Add functionality to manage volunteers and assign shifts.</li>
      </ul>
    </div>
  );
}

// Ensure the component is exported correctly
export default AdminDashboard;
