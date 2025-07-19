import React from 'react';

// This component receives props to handle page changes and logout
function Navbar({ setPage, userId, handleLogout }) {
  return (
    <header className="main-header">
      <div className="logo-container" onClick={() => setPage('landing')}>
        {/* New, unique SVG logo: Interlocking 'C's forming an 'S' for CrewSync */}
        <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 60 20 C 40 20, 20 40, 20 50 C 20 60, 40 80, 60 80" 
                stroke="#4f46e5" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M 40 80 C 60 80, 80 60, 80 50 C 80 40, 60 20, 40 20" 
                stroke="#a78bfa" strokeWidth="12" fill="none" strokeLinecap="round" />
        </svg>
        <span className="logo-text">CrewSync</span>
      </div>
      <nav className="main-nav">
        <a href="#about" onClick={() => setPage('about')}>About</a>
        <a href="#help" onClick={() => setPage('help')}>Help</a>
        {/* Conditionally render the Logout button if a user is logged in */}
        {userId && (
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
