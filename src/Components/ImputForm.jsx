// src/Components/ImputForm.jsx
import React, { useState } from 'react';

function ImputForm({ onCompare }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onCompare) {
      onCompare(origin, destination);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="imput-form">
      <input
        type="text"
        placeholder="Local de Partida"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <span className="arrow-loader">&#8594;</span>
      <input
        type="text"
        placeholder="Local de Destino"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button type="submit">Calcular</button>
    </form>
  );
}

export default ImputForm;
