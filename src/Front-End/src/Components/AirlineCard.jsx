import React from 'react';

function AirlineCard({ airline, options, iconUrl }) {
  return (
    <div className="airline-card">
      <div className="airline-card-header">
        <img src={iconUrl} alt={airline} className="airline-icon" />
        <h3 className="airline-name">{airline}</h3>
      </div>
      <div className="airline-options">
        {options.map((option, index) => (
          <p key={index} className="airline-option">{option}</p>
        ))}
      </div>
    </div>
  );
}

export default AirlineCard;