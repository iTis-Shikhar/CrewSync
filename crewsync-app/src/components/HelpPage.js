import React from 'react';

function HelpPage() {
  return (
    <div className="page-content fade-in">
      <h1>Help & FAQ</h1>
      <p className="page-intro">
        Find answers to common questions below. We've separated them by role to help you find what you need quickly.
      </p>
      
      <div className="faq-grid">
        {/* For Event Organizers */}
        <div className="faq-column">
          <h3>For Event Organizers</h3>
          <div className="faq-item">
            <h4>How do I add volunteers to an event?</h4>
            <p>From your Workspace, go to "View All Events" and click "Manage" on an event. In the "Volunteer Roster" section, click "Add from Directory" to open a searchable, multi-select list of all registered volunteers.</p>
          </div>
          <div className="faq-item">
            <h4>How do I create a multi-day shift?</h4>
            <p>On the "Manage Event" page, the "Create New Shift" form includes a "Date" field. You can create as many shifts as you need, each with its own specific date and time, within your event's date range.</p>
          </div>
          <div className="faq-item">
            <h4>How does the attendance system work?</h4>
            <p>It's a two-step process. First, a volunteer "Checks-in" from their dashboard. You will then see a "Confirm Presence" button appear for that shift on your "Manage Event" page. Clicking this confirms their attendance and moves the shift to their permanent work history.</p>
          </div>
        </div>

        {/* For Volunteers */}
        <div className="faq-column">
          <h3>For Volunteers</h3>
          <div className="faq-item">
            <h4>Why can't I see any announcements?</h4>
            <p>You will only see announcements for events that you have been added to by an organizer. As soon as you are added to an event's roster, you will begin receiving all announcements for that event in real-time.</p>
          </div>
          <div className="faq-item">
            <h4>Where is my work history?</h4>
            <p>Your dashboard is split into two sections. "My Upcoming Shifts" shows your active schedule. "Past Shifts (Permanent Record)" shows all the shifts where your attendance has been confirmed by an organizer. This history cannot be deleted, even if the event is removed.</p>
          </div>
          <div className="faq-item">
            <h4>How do I earn badges?</h4>
            <p>Badges are awarded automatically based on your work history. You'll earn your first badge after your attendance is confirmed for your very first shift, and more for things like perfect attendance!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
