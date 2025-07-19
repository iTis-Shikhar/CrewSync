import React from 'react';

// The setPage prop is a function passed down from App.js
// It allows this component to tell App.js to change the page.
function LandingPage({ setPage }) {
  // The old <header> section that was here has been removed.
  // The Navbar component in App.js now handles the header for all pages.
  return (
    <main className="hero-section">
      <h1 className="hero-headline">Effortless Volunteer Coordination</h1>
      <p className="hero-subheadline">
        Stop the chaos. Start organizing. CrewSync provides real-time shift management for large events, so you and your volunteers are always in sync.
      </p>
      <div className="cta-buttons-stacked">
        <button onClick={() => setPage('login')} className="btn btn-primary">Login</button>
        <button onClick={() => setPage('register')} className="btn btn-secondary">Register</button>
      </div>
    </main>
  );
}

export default LandingPage;
