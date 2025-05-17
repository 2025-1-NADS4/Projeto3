import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Components/Footer';
import TransportCard from '../Components/TransportCard';
import ImputForm from '../Components/ImputForm';
import Ubericon from '../Pictures/Ubericon.png';
import InDriveicon from '../Pictures/InDriveicon.png';
import novenoveicon from '../Pictures/novenoveicon.jpg';
import mockuporiginal from '../Pictures/mockuporiginal.png';
import dinheiroicon from '../Pictures/dinheiroicon.png';
import WeatherAnimation from '../Components/WeatherAnimation';
import Azul from '../Pictures/Azul.png';
import Gol from '../Pictures/Gol.png';
import latam from '../Pictures/latam.jpg';

// Função para converter um endereço em coordenadas [lon, lat] usando Nominatim
async function getCoordinates(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=pt-BR&q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data && data.length > 0) {
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  }
  throw new Error("Endereço não encontrado: " + address);
}


// Função para calcular a distância via OSRM (perfil driving)
const ORS_API_KEY = '5b3ce3597851110001cf6248b35ffe4a602e4377a66c33fa346b8b1e'; // Substitua pela sua chave de API

async function getDrivingDistance(origin, destination) {
  try {
    const originCoords = await getCoordinates(origin);
    const destinationCoords = await getCoordinates(destination);

    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const body = {
      coordinates: [originCoords, destinationCoords]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API ORS: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const distanceMeters = data.routes[0].summary.distance;
      const distanceKm = (distanceMeters / 1000).toFixed(2);
      return `${distanceKm} km`;
    }

    throw new Error("Nenhuma rota encontrada.");
  } catch (error) {
    throw new Error("Erro ao calcular a distância: " + error.message);
  }
}


function Home() {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [isAirlineMode, setIsAirlineMode] = useState(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [showPrices, setShowPrices] = useState(false); // novo estado para controlar exibição dos preços

  // Dados de precificação do JSON (arquivo: corridasexemplo.json)
  const [rideData, setRideData] = useState(null);

  // Estado para condição climática: "sunny", "lightRain" ou "storm"
  const [weatherCondition, setWeatherCondition] = useState("sunny");

  useEffect(() => {
    fetch('/corridasexemplo.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar os dados de preços');
        }
        return response.json();
      })
      .then(json => setRideData(json))
      .catch(error => console.error('Erro:', error));
  }, []);

const handleCompare = async (origin, destination) => {
  setOriginAddress(origin);
  setDestinationAddress(destination);
  try {
    const routeDistance = await getDrivingDistance(origin, destination);
    setDistance(routeDistance);
    setErrorMessage('');
    setShowPrices(false); // ao recalcular distância, oculta os preços novamente
  } catch (error) {
    setErrorMessage(error.message);
    setDistance(null);
  }
};


  const handleComparePrices = () => {
    console.log("Comparar preços para:");
    console.log("Origem:", originAddress);
    console.log("Destino:", destinationAddress);
    console.log("Distância:", distance);
    // Ao clicar, habilita a exibição dos preços
    setShowPrices(true);
  };

  const handleTraffic = () => {
    if (!originAddress || !destinationAddress) {
      alert("Por favor, informe o endereço de partida e destino primeiro.");
      return;
    }
    const url = `/traffic?origin=${encodeURIComponent(originAddress)}&destination=${encodeURIComponent(destinationAddress)}&weather=${weatherCondition}`;
    window.open(url, '_blank');
  };

  const handleSwitchMode = (mode) => {
    setIsAirlineMode(mode === 'airline');
  };

  const handleUnlockPremium = () => {
    setIsPremiumUnlocked(true);
  };

  return (
    <>
      {/* Seção 1: Herói */}
      <section className="section section-hero">
        <div className="content">
          <h1 className="company-name">FastPrice</h1>
          <p className="tagline">Encontre o melhor preço de transporte em um clique!</p>
        </div>
      </section>

      {/* Seção 2: Sobre a Empresa */}
      <section className="section section-about">
        <div className="about-container">
          <div className="about-image">
            <img src={dinheiroicon} alt="Dinheiro Icon" />
          </div>
          <div className="about-text">
            <h2>Sobre Nós</h2>
            <p>
              Na FastPrice, reunimos informações das principais plataformas de transporte, como <span className="highlight">Uber</span>, <span className="highlight">99</span> e <span className="highlight">InDrive</span>, para oferecer a melhor comparação de preços e conforto.
            </p>
          </div>
        </div>
      </section>

      {/* Seção 2.5: Destaque */}
      <section className="section section-highlight">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 highlight-image">
              <img src={mockuporiginal} alt="Destaque FastPrice" className="img-fluid" />
            </div>
            <div className="col-md-6 highlight-text">
              <h2 className="highlight-title">Sua Melhor Escolha em Transporte</h2>
              <h3 className="highlight-subtitle">Conectando você ao melhor preço e conforto</h3>
              <p>• Experiência inovadora e intuitiva para comparar opções.</p>
              <p>• Economia real com transparência e rapidez.</p>
              <p>• Facilidade na escolha da melhor opção para seu destino.</p>
              <p>• Confiança e segurança em cada corrida.</p>
              <div className="feedback-button-container text-center mt-5">
                <Link to="/feedbacks" className="btn btn-feedback animate__animated animate__fadeIn">
                  Ver Feedbacks
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 3: Comparativo de Preços com Animação de Clima */}
      <section className="section section-pricing">
        <div className="pricing-weather-container">
          <div className="compare-area">
            <h2>Comparativo de Preços</h2>
            <ImputForm onCompare={handleCompare} />
            {errorMessage && <p className="error">{errorMessage}</p>}
            {distance && (
              <div className="distance-area">
                <span className="distance-info">Distância: {distance}</span>
                <button 
                  className="compare-btn" 
                  onClick={handleComparePrices}
                  disabled={isAirlineMode && !isPremiumUnlocked}
                >
                  Comparar Preços
                </button>
                 <button className="traffic-btn" onClick={handleTraffic} style={{ marginLeft: '10px' }}>
                  Como está o trânsito?
                </button>
              </div>
            )}

            {/* Switch e conteúdo de transporte */}
            {isAirlineMode && !isPremiumUnlocked ? (
              <div className="premium-block-wrapper">
                <div className="premium-block">
                  <div className="switch-container">
                    <button className="switch-button" onClick={() => handleSwitchMode('terrestrial')}>
                      Transporte Terrestre
                    </button>
                    <button className="switch-button active locked" onClick={() => handleSwitchMode('airline')}>
                      Viagens Aéreas <span className="lock-icon"></span>
                    </button>
                  </div>
                  <div className="card-container">
                    <TransportCard platform="Gol" options={["Gol", "Gol Premium"]} iconUrl={Gol} distance={distance} weatherCondition={weatherCondition} showPrices={showPrices} />
                    <TransportCard platform="Latam" options={["Latam", "Latam Business"]} iconUrl={latam} distance={distance} weatherCondition={weatherCondition} showPrices={showPrices} />
                    <TransportCard platform="Azul" options={["Azul", "Azul Conforto"]} iconUrl={Azul} distance={distance} weatherCondition={weatherCondition} showPrices={showPrices} />
                  </div>
                </div>
                <div className="unlock-overlay">
                  <button onClick={handleUnlockPremium}>Desbloquear Premium</button>
                </div>
              </div>
            ) : (
              <>
                <div className="switch-container">
                  <button 
                    className={`switch-button ${!isAirlineMode ? "active" : ""}`}
                    onClick={() => handleSwitchMode('terrestrial')}
                  >
                    Transporte Terrestre
                  </button>
                  <button 
                    className={`switch-button ${isAirlineMode ? "active" : "locked"}`}
                    onClick={() => handleSwitchMode('airline')}
                  >
                    Viagens Aéreas {!isPremiumUnlocked && <span className="lock-icon"></span>}
                  </button>
                </div>
                <div className="card-container">
                  {isAirlineMode ? (
                    <>
                      <TransportCard platform="Gol" options={["Gol", "Gol Premium"]} iconUrl={Gol} distance={distance} weatherCondition={weatherCondition} showPrices={showPrices} />
                      <TransportCard platform="Latam" options={["Latam", "Latam Business"]} iconUrl={latam} distance={distance} weatherCondition={weatherCondition} showPrices={showPrices} />
                      <TransportCard platform="Azul" options={["Azul", "Azul Conforto"]} iconUrl={Azul} distance={distance} weatherCondition={weatherCondition} showPrices={showPrices} />
                    </>
                  ) : (
                    <>
                      {!rideData ? (
                        <p>Carregando dados de preços...</p>
                      ) : (
                        <>
                          <TransportCard
                            platform="Uber"
                            options={["UberX", "UberComfort", "UberBlack"]}
                            iconUrl={Ubericon}
                            priceData={{
                              "UberX": rideData?.uberX?.price,
                              "UberComfort": rideData?.uberComfort?.price,
                              "UberBlack": rideData?.uberBlack?.price
                            }}
                            distance={distance}
                            weatherCondition={weatherCondition}
                            showPrices={showPrices}
                          />
                          <TransportCard
                            platform="99"
                            options={["99POP", "99Comfort", "99Taxi"]}
                            iconUrl={novenoveicon}
                            priceData={{
                              "99POP": rideData?.["99POP"]?.price,
                              "99Comfort": rideData?.["99Comfort"]?.price,
                              "99Taxi": rideData?.["99Taxi"]?.price
                            }}
                            distance={distance}
                            weatherCondition={weatherCondition}
                            showPrices={showPrices}
                          />
                          <TransportCard
                            platform="InDrive"
                            options={["InDriveComum"]}
                            iconUrl={InDriveicon}
                            priceData={{
                              "InDriveComum": rideData?.indriveComum?.price
                            }}
                            distance={distance}
                            weatherCondition={weatherCondition}
                            showPrices={showPrices}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
            
            <WeatherAnimation />
          </div>
        </div>
      </section>

      {/* Seção 4: Footer */}
      <section className="section section-footer">
        <Footer />
      </section>
    </>
  );
}

export default Home;
