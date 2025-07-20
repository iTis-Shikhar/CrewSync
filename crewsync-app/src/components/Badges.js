import React from 'react';

// This component receives a list of earned badges and displays them.
function Badges({ earnedBadges }) {
  // A predefined list of all possible badges and their details
  const allBadges = {
    firstShift: { 
      icon: '🎉', 
      title: 'First Shift Complete', 
      description: 'You completed your first shift. Welcome to the team!' 
    },
    punctualPro: { 
      icon: '⏰', 
      title: 'Punctual Pro', 
      description: 'You have a perfect attendance record. Amazing!' 
    },
    // We can add more badges here in the future
  };

  return (
    <div className="badges-section">
      <h3>Your Achievements</h3>
      <div className="badges-grid">
        {earnedBadges.map(badgeKey => (
          <div key={badgeKey} className="badge-card">
            <span className="badge-icon">{allBadges[badgeKey].icon}</span>
            <div className="badge-info">
              <span className="badge-title">{allBadges[badgeKey].title}</span>
              <span className="badge-description">{allBadges[badgeKey].description}</span>
            </div>
          </div>
        ))}
        {earnedBadges.length === 0 && (
          <p className="no-badges-message">Complete your first shift to start earning badges!</p>
        )}
      </div>
    </div>
  );
}

export default Badges;
