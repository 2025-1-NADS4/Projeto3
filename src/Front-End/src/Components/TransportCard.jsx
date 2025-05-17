import React, { useState } from 'react';

function TransportCard({ platform, options, iconUrl, priceData, distance, weatherCondition }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Fatores de multiplicação para cada opção (base)
  const pricingFactors = {
    "uberX": 2.0,
    "uberComfort": 2.5,
    "uberBlack": 3.0,
    "99POP": 1.8,
    "99Comfort": 2.2,
    "99Taxi": 2.0,
    "indriveComum": 1.5
  };

  // Fatores para condições climáticas
  const weatherFactors = {
    sunny: 1.0,
    lightRain: 1.2,
    storm: 1.5
  };

  // Calcula o preço final com base no preço base, distância e condição climática
  const calculateFinalPrice = (option, basePriceString, distanceStr) => {
    if (!basePriceString) return "";
    const basePrice = parseFloat(basePriceString.replace("R$", "").replace(",", "."));
    const distanceKm = parseFloat(distanceStr); // Espera-se que distanceStr seja algo como "12.00 km"
    const factor = pricingFactors[option] || 2.0;
    const weatherFactor = weatherFactors[weatherCondition] || 1.0;
    const finalPrice = (basePrice + (distanceKm * factor)) * weatherFactor;
    return "R$ " + finalPrice.toFixed(2);
  };

  // Calcula os preços para cada opção para identificar a menor
  const computedPrices = options.map(option => {
    if (priceData && priceData[option] && distance) {
      const priceStr = calculateFinalPrice(option, priceData[option], distance);
      return parseFloat(priceStr.replace("R$", "").trim());
    }
    return Infinity;
  });
  const minPrice = Math.min(...computedPrices);

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
        {options.map((option, index) => {
          const finalPriceString = priceData && priceData[option] && distance 
            ? calculateFinalPrice(option, priceData[option], distance) 
            : "";
          const finalPriceValue = finalPriceString ? parseFloat(finalPriceString.replace("R$", "").trim()) : Infinity;
          const isBestOption = finalPriceValue === minPrice;
          return (
            <li key={index} className={isBestOption ? 'best-option' : ''}>
              <span>{option}</span>
              {finalPriceString && (
                <span className="price">
                  {finalPriceString} {isBestOption && <span className="trophy">🏆</span>}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TransportCard;
