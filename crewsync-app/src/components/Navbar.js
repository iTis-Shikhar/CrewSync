import React from 'react';

// Component now accepts `userName` as a prop
function Navbar({ setPage, userId, userName, handleLogout }) {
  return (
    <header className="main-header">
      <div className="logo-container" onClick={() => setPage(userId ? 'dashboard' : 'landing')}>
        <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 60 20 C 40 20, 20 40, 20 50 C 20 60, 40 80, 60 80" 
                stroke="#4f46e5" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M 40 80 C 60 80, 80 60, 80 50 C 80 40, 60 20, 40 20" 
                stroke="#a78bfa" strokeWidth="12" fill="none" strokeLinecap="round" />
        </svg>
        <span className="logo-text">CrewSync</span>
      </div>
      <nav className="main-nav">
        {/* NEW: Conditionally render "Dashboard" link if logged in */}
        {userId && (
          <a href="#dashboard" onClick={() => setPage('dashboard')} className="nav-link-dashboard">Dashboard</a>
        )}
        <a href="#about" onClick={() => setPage('about')}>About</a>
        <a href="#help" onClick={() => setPage('help')}>Help</a>
        
        {/* Display user name and logout button */}
        {userId && (
          <div className="nav-user-section">
            <span className="user-greeting">Welcome, {userName}!</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
