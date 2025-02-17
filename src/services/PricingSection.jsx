import React, { useState } from 'react';
import Card from '../Components/Card';

function PricingSection() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleCompare = () => {
    // Aqui você pode chamar alguma função que faça a comparação de preços
    console.log("Comparando preços para:", origin, destination);
  };

  return (
    <section className="section section-pricing">
      <div className="content">
        <h2>Comparativo de Preços</h2>
        {/* Área de busca com inputs e botão */}
        <div className="search-area">
          <input 
            type="text" 
            placeholder="Digite seu endereço de origem" 
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Digite seu destino" 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button onClick={handleCompare}>Comparar Preços</button>
        </div>

        {/* Cards de comparação */}
        <div className="card-container">
          <Card 
            title="Uber" 
            options={["UberX", "Uber Comfort", "UberBlack"]} 
          />
          <Card 
            title="99" 
            options={["99POP", "99Comfort", "99Taxi"]} 
          />
          <Card 
            title="InDrive" 
            options={["InDrive"]} 
          />
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
