import React from 'react';

function Navbar({ setPage, userId, userName, handleLogout }) {
  return (
    <header className="main-header">
      {/* Left Side: Logo */}
      <div className="logo-container" onClick={() => setPage(userId ? 'dashboard' : 'landing')}>
        <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 60 20 C 40 20, 20 40, 20 50 C 20 60, 40 80, 60 80" 
                stroke="#4f46e5" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M 40 80 C 60 80, 80 60, 80 50 C 80 40, 60 20, 40 20" 
                stroke="#a78bfa" strokeWidth="12" fill="none" strokeLinecap="round" />
        </svg>
        <span className="logo-text">CrewSync</span>
      </div>

      {/* Right Side: All navigation and user controls */}
      <nav className="main-nav-right">
        <a href="#about" className="nav-link" onClick={() => setPage('about')}>About</a>
        <a href="#help" className="nav-link" onClick={() => setPage('help')}>Help</a>
        
        {/* Only show these when a user is logged in */}
        {userId && (
          <>
            <a href="#dashboard" className="nav-link" onClick={() => setPage('dashboard')}>Dashboard</a>
            <div className="nav-user-box">
              <div className="user-greeting">
                <span className="user-greeting-name">{userName}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Logout"></button>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
