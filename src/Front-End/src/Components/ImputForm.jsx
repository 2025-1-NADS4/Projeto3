// src/Components/ImputForm.jsx
import React, { useState, useEffect } from 'react';

function parseStreetAndNumber(query) {
  const match = query.match(/^(.*?)[,\s]+(\d+)$/);
  if (match) {
    return { street: match[1].trim(), number: match[2].trim() };
  }
  return { street: query, number: '' };
}

const formatAddress = (suggestion) => {
  if (suggestion.address) {
    const road = suggestion.address.road || "";
    const houseNumber = suggestion.address.house_number || "";
    const neighborhood = suggestion.address.suburb || suggestion.address.neighbourhood || "";
    const state = suggestion.address.state || "";
    const parts = [];
    if (road) parts.push(road);
    if (houseNumber) parts.push(houseNumber);
    if (neighborhood) parts.push(neighborhood);
    if (state) parts.push(state);
    return parts.join(', ');
  }
  return suggestion.display_name;
};

function ImputForm({ onCompare }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [hoveredOriginIndex, setHoveredOriginIndex] = useState(-1);
  const [hoveredDestinationIndex, setHoveredDestinationIndex] = useState(-1);

  const suggestionsStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    listStyle: 'none',
    margin: '4px 0 0 0',
    padding: '4px 0'
  };

  const suggestionItemStyle = {
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s, color 0.2s'
  };

  const suggestionItemHoverStyle = {
    backgroundColor: '#f0f8ff',
    color: '#000'
  };

  const fetchSuggestions = (query, setSuggestions) => {
    const emailParam = "ryandoliveira@hotmail.com";
    const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&accept-language=pt-BR&countrycodes=br&email=" 
              + encodeURIComponent(emailParam)
              + "&q="
              + encodeURIComponent(query);
    console.log("URL gerada:", url);
    fetch(url, { mode: 'cors', headers: { 'Accept': 'application/json' } })
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => console.error('Erro no autocomplete:', err));
  };

  useEffect(() => {
    if (origin.trim().length >= 3) {
      const timer = setTimeout(() => {
        fetchSuggestions(origin.trim(), setOriginSuggestions);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setOriginSuggestions([]);
    }
  }, [origin]);

  useEffect(() => {
    if (destination.trim().length >= 3) {
      const timer = setTimeout(() => {
        fetchSuggestions(destination.trim(), setDestinationSuggestions);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setDestinationSuggestions([]);
    }
  }, [destination]);

  const handleOriginFocus = () => {
    if (origin.trim().length >= 3) {
      fetchSuggestions(origin.trim(), setOriginSuggestions);
    }
  };

  const handleDestinationFocus = () => {
    if (destination.trim().length >= 3) {
      fetchSuggestions(destination.trim(), setDestinationSuggestions);
    }
  };

  const handleOriginSelect = (suggestion) => {
    setOrigin(formatAddress(suggestion));
    setOriginSuggestions([]);
  };

  const handleDestinationSelect = (suggestion) => {
    setDestination(formatAddress(suggestion));
    setDestinationSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onCompare) {
      onCompare(origin, destination);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="imput-form">
      <div className="input-wrapper" style={{ position: 'relative' }}>
        <label htmlFor="origin-input">Local de Partida</label>
        <input
          id="origin-input"
          type="text"
          placeholder="Digite o endereço de partida"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          onFocus={handleOriginFocus}
        />
        {originSuggestions.length > 0 && (
          <ul className="autocomplete-suggestions" style={suggestionsStyle}>
            {originSuggestions.map((suggestion, index) => (
              <li
                key={suggestion.place_id}
                onMouseEnter={() => setHoveredOriginIndex(index)}
                onMouseLeave={() => setHoveredOriginIndex(-1)}
                onClick={() => handleOriginSelect(suggestion)}
                style={
                  hoveredOriginIndex === index
                    ? { ...suggestionItemStyle, ...suggestionItemHoverStyle }
                    : suggestionItemStyle
                }
              >
                {formatAddress(suggestion)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <span className="arrow-loader">&#8594;</span>
      <div className="input-wrapper" style={{ position: 'relative' }}>
        <label htmlFor="destination-input">Local de Destino</label>
        <input
          id="destination-input"
          type="text"
          placeholder="Digite o endereço de destino"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onFocus={handleDestinationFocus}
        />
        {destinationSuggestions.length > 0 && (
          <ul className="autocomplete-suggestions" style={suggestionsStyle}>
            {destinationSuggestions.map((suggestion, index) => (
              <li
                key={suggestion.place_id}
                onMouseEnter={() => setHoveredDestinationIndex(index)}
                onMouseLeave={() => setHoveredDestinationIndex(-1)}
                onClick={() => handleDestinationSelect(suggestion)}
                style={
                  hoveredDestinationIndex === index
                    ? { ...suggestionItemStyle, ...suggestionItemHoverStyle }
                    : suggestionItemStyle
                }
              >
                {formatAddress(suggestion)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit">Calcular</button>
    </form>
  );
}

export default ImputForm;
