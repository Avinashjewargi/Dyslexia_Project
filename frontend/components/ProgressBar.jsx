// frontend/components/ProgressBar.jsx

import React from 'react';
import { ProgressBar } from 'react-bootstrap';

/**
 * Reusable component to display a styled Bootstrap progress bar.
 * @param {string} label - The text label for the progress bar.
 * @param {number} value - The current progress value (0 to 100).
 * @param {string} variant - The color variant ('primary', 'success', 'info', etc.).
 */
function AppProgressBar({ label, value, variant = 'primary' }) {
  // Ensure the value is within the 0-100 range
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="mb-3">
      <h6 className="text-muted">{label}</h6>
      <ProgressBar 
        variant={variant} 
        now={safeValue} 
        label={`${safeValue}%`}
        style={{ height: '25px', fontSize: '1rem' }}
      />
    </div>
  );
}

export default AppProgressBar;