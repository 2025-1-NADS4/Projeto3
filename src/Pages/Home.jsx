// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importar o Link
import Footer from '../Components/Footer';
import ImputForm from '../Components/ImputForm';
import Ubericon from '../Pictures/Ubericon.png';
import InDriveicon from '../Pictures/InDriveicon.png';
import novenoveicon from '../Pictures/novenoveicon.jpg';
import TransportCard from '../Components/TransportCard';
import mockuporiginal from '../Pictures/mockuporiginal.png';
import dinheiroicon from '../Pictures/dinheiroicon.png';


function Home() {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Função para obter a distância real via Google Distance Matrix API
  const getDrivingDistance = async (originAddress, destinationAddress) => {
    const origin = encodeURIComponent(originAddress);
    const destination = encodeURIComponent(destinationAddress);
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Substitua pela sua chave de API real
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=driving&units=metric&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log("Distance Matrix Data:", data);

    if (
      data.status === "OK" &&
      data.rows &&
      data.rows[0] &&
      data.rows[0].elements &&
      data.rows[0].elements[0].status === "OK"
    ) {
      return data.rows[0].elements[0].distance.text;
    } else {
      throw new Error("Erro ao calcular a distância de rota.");
    }
  };

  // Função chamada ao submeter o formulário
  const handleCompare = async (originInput, destInput) => {
    setOriginAddress(originInput);
    setDestinationAddress(destInput);

    try {
      const routeDistance = await getDrivingDistance(originInput, destInput);
      console.log("Distância calculada:", routeDistance);
      setDistance(routeDistance);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Não foi possível obter a distância dos endereços informados.');
    }
  };

  // Função para quando o usuário clica em "Comparar Preços"
  const handleComparePrices = () => {
    console.log("Comparar preços para:");
    console.log("Origem:", originAddress);
    console.log("Destino:", destinationAddress);
    console.log("Distância:", distance);
    // Aqui você pode implementar a lógica real de comparação de preços
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
    {/* Coluna esquerda: Imagem */}
    <div className="about-image">
      <img src={dinheiroicon} alt="Dinheiro Icon" />
    </div>
    {/* Coluna direita: Texto */}
    <div className="about-text">
      <h2>Sobre Nós</h2>
      <p>
        Na FastPrice, reunimos informações das principais plataformas de transporte, como 
        <span className="highlight"> Uber</span>, 
        <span className="highlight"> 99</span> e 
        <span className="highlight"> InDrive</span>, para oferecer a você a melhor comparação de preços.
        Nosso objetivo é facilitar sua mobilidade e ajudar você a tomar a decisão mais vantajosa.
      </p>
    </div>
  </div>
</section>


      {/* Seção 2.5: Destaque */}
      <section className="section section-highlight">
        <div className="container">
          <div className="row align-items-center">
            {/* Coluna para a imagem */}
            <div className="col-md-6 highlight-image">
              <img src={mockuporiginal} alt="Destaque FastPrice" className="img-fluid" />
            </div>
            {/* Coluna para o texto */}
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

      {/* Seção 3: Comparativo de Preços */}
      <section className="section section-pricing">
        <div className="content">
          <h2>Comparativo de Preços</h2>
          <div className="compare-area">
            {/* Componente de entrada para os endereços */}
            <ImputForm onCompare={handleCompare} />
            {errorMessage && <p className="error">{errorMessage}</p>}
            {distance && (
              <div className="distance-area">
                <span className="distance-info">Distância: {distance}</span>
                <button className="compare-btn" onClick={handleComparePrices}>
                  Comparar Preços
                </button>
              </div>
            )}
          </div>
          {/* Cards com o menu hamburguer moderno, alinhados lado a lado */}
          <div className="card-container">
            <TransportCard 
              platform="Uber" 
              options={["UberX", "Uber Comfort", "UberBlack"]} 
              iconUrl={Ubericon}
            />
            <TransportCard 
              platform="99" 
              options={["99POP", "99Comfort", "99Taxi"]} 
              iconUrl={novenoveicon}
            />
            <TransportCard 
              platform="InDrive" 
              options={["InDrive"]} 
              iconUrl={InDriveicon}
            />
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
