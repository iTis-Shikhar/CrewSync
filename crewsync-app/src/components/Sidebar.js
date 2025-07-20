import React from 'react';

function Sidebar({ page, setPage }) {
  const getLinkClass = (linkName) => {
    return page === linkName ? 'sidebar-link active' : 'sidebar-link';
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <a href="#dashboard" className={getLinkClass('dashboard')} onClick={() => setPage('dashboard')}>
          {/* Workspace Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-5-1.5l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5M6 16.5v-3.75m0 3.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m0 0v-3.75m3 3.75h12M18 16.5v-3.75m0 3.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m0 0v-3.75" /></svg>
          <span>Workspace</span>
        </a>
        <a href="#events" className={getLinkClass('eventList')} onClick={() => setPage('eventList')}>
          {/* Calendar Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>
          <span>Events</span>
        </a>
        <a href="#analytics" className={getLinkClass('analytics')} onClick={() => setPage('analytics')}>
          {/* Chart Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v16.5h16.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5m-16.5 0l4.5-4.5 3 3 6-6" /></svg>
          <span>Analytics</span>
        </a>
        {/* The new link for the Volunteer Directory */}
        <a href="#volunteers" className={getLinkClass('volunteers')} onClick={() => setPage('volunteers')}>
          {/* Users Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.147.252-.288.394-.428m-11.964 4.67a8.25 8.25 0 0011.964-4.67L9.376 11H3.75a3 3 0 01-3-3V7.5a3 3 0 013-3h1.5m9 1.5H7.5m7.5 0a3 3 0 013 3V7.5a3 3 0 01-3 3H7.5" /></svg>
          <span>Volunteers</span>
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
