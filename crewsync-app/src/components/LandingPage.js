import React from 'react';

// The setPage prop is a function passed down from App.js
// It allows this component to tell App.js to change the page.
function LandingPage({ setPage }) {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo-container">
          {/* A simple SVG for our logo */}
          <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <circle cx="30" cy="50" r="15" fill="#4f46e5"/>
              <circle cx="70" cy="50" r="15" fill="#818cf8"/>
              <path d="M 30 65 C 40 85, 60 85, 70 65" stroke="#a78bfa" strokeWidth="5" fill="none"/>
              <path d="M 30 35 C 40 15, 60 15, 70 35" stroke="#a78bfa" strokeWidth="5" fill="none"/>
            </g>
          </svg>
          <span className="logo-text">CrewSync</span>
        </div>
        <nav className="main-nav">
          <a href="#about">About</a>
          <a href="#help">Help</a>
        </nav>
      </header>

      <main className="hero-section">
        <h1 className="hero-headline">Effortless Volunteer Coordination</h1>
        <p className="hero-subheadline">
          Stop the chaos. Start organizing. CrewSync provides real-time shift management for large events, so you and your volunteers are always in sync.
        </p>
        <div className="cta-buttons">
          {/* When clicked, these buttons call setPage to change the view in App.js */}
          <button onClick={() => setPage('register')} className="btn btn-primary">Register Now</button>
          <button onClick={() => setPage('login')} className="btn btn-secondary">Admin Login</button>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
