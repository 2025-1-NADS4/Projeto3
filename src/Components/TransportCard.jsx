// src/Components/TransportCard.jsx
import React, { useState } from 'react';

function TransportCard({ platform, options, iconUrl }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="transport-card">
      <div className="card-icon">
        {iconUrl ? (
          <img src={iconUrl} alt={`${platform} Logo`} />
        ) : (
          <i className="fas fa-car"></i>
        )}
      </div>
      <div className="card-header">
        <h3>{platform}</h3>
        <button className="hamburger" onClick={toggleMenu}>
          &#9776;
        </button>
      </div>
      <ul className={`card-options ${menuOpen ? 'open' : ''}`}>
        {options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
    </div>
  );
}

export default TransportCard;
