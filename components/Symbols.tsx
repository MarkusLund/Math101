import React from 'react';

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export const CircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" />
    </svg>
);

export const CarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.5,16.5a1.5,1.5,0,1,1-1.5,1.5,1.5,1.5,0,0,1,1.5-1.5m-12,0a1.5,1.5,0,1,1-1.5,1.5,1.5,1.5,0,0,1,1.5-1.5m12.35-6.35-1.5-4.5A2.43,2.43,0,0,0,16.5,4h-9a2.43,2.43,0,0,0-1.85,1.15l-1.5,4.5A2.4,2.4,0,0,0,2.1,13.5H2v2a1,1,0,0,0,1,1h1.25a2.5,2.5,0,1,0,4.58,0h5.34a2.5,2.5,0,1,0,4.58,0H21a1,1,0,0,0,1-1v-2h-.1A2.4,2.4,0,0,0,19.85,10.15Z" />
    </svg>
);

export const GhostIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12,2A9,9,0,0,0,3,11V22L6,19l3,3,3-3,3,3,3-3,3,3V11A9,9,0,0,0,12,2Zm-2,9.5a1.5,1.5,0,1,1-1.5-1.5A1.5,1.5,0,0,1,10,11.5Zm4,0a1.5,1.5,0,1,1-1.5-1.5A1.5,1.5,0,0,1,14,11.5Z" />
    </svg>
);
