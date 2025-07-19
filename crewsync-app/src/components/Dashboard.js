import React from 'react';

// The handleLogout prop is a function passed down from App.js
function Dashboard({ handleLogout }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>You are logged in and can now manage your event.</p>
      </header>
      <main className="dashboard-content">
        <h2>Event Management</h2>
        <p>This is where the forms and lists for creating and managing events will go. We will build this in the next phase!</p>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </main>
    </div>
  );
}

export default Dashboard;
