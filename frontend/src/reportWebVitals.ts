// src/reportWebVitals.ts

// Import the specific type for the callback function
import type { ReportCallback } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportCallback): void => {
  // Check if the callback is actually a function
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Dynamically import the web-vitals library
    import('web-vitals')
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        // Call the individual metric reporting functions with the callback
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
      })
      .catch((err) => {
        // Handle potential errors during dynamic import
        console.error('Failed to load web-vitals', err);
      });
  }
};

export default reportWebVitals;
