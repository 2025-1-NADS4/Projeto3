import React, { useState, useEffect } from "react";
import "../styles/WeatherAnimation.css"; // Certifique-se de que o caminho está correto
import sol from "../Pictures/sol.gif";
import chuva from "../Pictures/chuva.gif";
import tempestade from "../Pictures/tempestade.gif";

// Tempo de mudança do clima (em segundos) para teste
const CLOUDY_TIME = 60;   // Ex.: 6 segundos para "cloudy"
const STORM_TIME = 120;   // Ex.: 12 segundos para "storm"
const CYCLE_TIME = 180;   // Ex.: 18 segundos para reiniciar e voltar a "sunny"

function WeatherAnimation() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [weather, setWeather] = useState("sunny"); // 'sunny', 'cloudy', 'storm'
  const [fade, setFade] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showWeather, setShowWeather] = useState(true);

  const messages = {
    sunny: "Tempo limpo e ensolarado",
    cloudy: "Chuva a caminho",
    storm: "Chuvas intensas na sua região",
  };

  const [popupMessage, setPopupMessage] = useState(messages.sunny);

  // Mapeamento dos estados para os GIFs utilizando as importações
  const gifUrls = {
    sunny: sol,
    cloudy: chuva,
    storm: tempestade,
  };

  // Atualiza o contador de tempo a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Verifica e atualiza o estado do clima e exibe o popup
  useEffect(() => {
    let newWeather = "sunny";
    if (timeElapsed >= CYCLE_TIME) {
      newWeather = "sunny";
    } else if (timeElapsed >= STORM_TIME) {
      newWeather = "storm";
    } else if (timeElapsed >= CLOUDY_TIME) {
      newWeather = "cloudy";
    } else {
      newWeather = "sunny";
    }

    if (newWeather !== weather) {
      let newPopupMessage = messages[newWeather];
      if (newWeather === "sunny" && weather === "storm") {
        newPopupMessage = "Céu limpo, o preço das corridas normalizaram";
      }
      setFade(true); // Inicia fade-out
      setTimeout(() => {
        setWeather(newWeather);
        setFade(false); // Inicia fade-in

        if (
          newWeather === "cloudy" ||
          newWeather === "storm" ||
          (newWeather === "sunny" && weather === "storm")
        ) {
          setPopupMessage(newPopupMessage);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 3000); // Exibe o popup por 3 segundos
        }

        if (timeElapsed >= CYCLE_TIME) {
          setTimeElapsed(0);
        }
      }, 300); // Duração da transição (fade)
    }
  }, [timeElapsed, weather, messages]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!showWeather) return null;

  return (
    <div className="weather-container">
      <button className="weather-close" onClick={() => setShowWeather(false)}>X</button>
      <div className={`weather-icon ${weather}-icon ${fade ? "fade-out" : "fade-in"}`} />
      <div className={`weather-message ${fade ? "fade-out" : "fade-in"}`}>
        {messages[weather]}
      </div>
      <div className="timer">{formatTime(timeElapsed)}</div>
      {showPopup && (
        <div className="weather-popup">
          <div className="popup-content">
            <img
              key={weather}  // Força atualização do GIF quando o estado muda
              src={gifUrls[weather]}
              alt={weather}
              className="popup-gif"
            />
            <h3>{popupMessage}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherAnimation;
