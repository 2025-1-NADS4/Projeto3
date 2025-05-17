import React from "react";
import ReactDOM from "react-dom/client";  // Importa corretamente o React 18
import App from "./App";
import "./styles/global.css";  // Importa a estilização global

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
