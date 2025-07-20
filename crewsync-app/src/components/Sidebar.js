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
        <a href="#analytics" className={getLinkClass('analytics')} onClick={() => setPage('analytics')}>
          {/* Chart Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v16.5h16.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5m-16.5 0l4.5-4.5 3 3 6-6" /></svg>
          <span>Analytics</span>
        </a>
        {/* The "Volunteers" link has been removed */}
      </nav>
    </aside>
  );
}

export default Sidebar;
