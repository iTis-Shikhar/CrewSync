import React from 'react';

// A reusable component to display when a list is empty
function EmptyState({ icon, message, children }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon}
      </div>
      <p className="empty-state-message">{message}</p>
      {/* 'children' allows us to pass other elements, like a button, if needed */}
      {children}
    </div>
  );
}

export default EmptyState;
