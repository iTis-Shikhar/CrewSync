import React from 'react';

function AboutPage() {
  return (
    <div className="page-content fade-in">
      <h1>About CrewSync</h1>
      <p className="page-intro">
        CrewSync was born from the chaotic energy of large-scale events. We saw the logistical puzzles organizers face—messy spreadsheets, endless group chats, and the constant challenge of keeping everyone informed. Our mission is to replace that chaos with clarity and connection.
      </p>
      
      <div className="features-grid">
        {/* For Event Organizers */}
        <div className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-1.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
          </div>
          <h3>For Event Organizers</h3>
          <p>
            Gain ultimate control with a powerful workspace. Create multi-day events, manage shifts with specific dates and times, and build your volunteer roster with an intelligent, searchable directory. Send real-time announcements to your crew, track attendance with a two-step confirmation process, and gain valuable insights with our analytics dashboard.
          </p>
        </div>

        {/* For Volunteers */}
        <div className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          </div>
          <h3>For Volunteers</h3>
          <p>
            Experience clarity and recognition. Your personalized dashboard shows you exactly where you need to be and when, with separate views for upcoming and past shifts. Receive instant announcements from your organizer, check-in for your shifts with a single click, and build a permanent, undeletable record of your work. Earn badges for your contributions and stay motivated!
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
