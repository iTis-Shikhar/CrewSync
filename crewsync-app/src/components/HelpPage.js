import React from 'react';

function HelpPage() {
  return (
    <div className="page-content">
      <h1>Help & FAQ</h1>
      
      <h3>For Event Organizers</h3>
      <p><strong>Q: How do I create an event?</strong><br/>
      A: Once logged into your Admin Dashboard, you will see an "Event Management" section. Click on "Create New Event" and fill in the required details.
      </p>
      <p><strong>Q: How do I add volunteers?</strong><br/>
      A: In the "Volunteer Management" section of your dashboard, you can add volunteers by providing their name and contact information. They will then be available to be assigned to shifts.
      </p>

      <h3>For Volunteers</h3>
      <p><strong>Q: How do I see my schedule?</strong><br/>
      A: Simply log in with the credentials provided to you by the event organizer. Your dashboard will automatically display a personalized view of only your assigned shifts and duties.
      </p>
      <p><strong>Q: What if my schedule changes?</strong><br/>
      A: Your dashboard is updated in real-time. Any changes made by the event organizer will be reflected on your task view immediately.
      </p>
    </div>
  );
}

export default HelpPage;
