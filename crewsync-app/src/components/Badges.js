import React from 'react';

function Badges({ earnedBadges }) {
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
  };

  // THIS IS THE SAFETY CHECK: If earnedBadges is not a valid array, don't render anything.
  if (!Array.isArray(earnedBadges)) {
    return null;
  }

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
