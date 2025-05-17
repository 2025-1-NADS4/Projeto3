
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Feedbacks from "./Pages/Feedbacks";
import Traffic from "./Pages/Traffic";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedbacks" element={<Feedbacks />} />
        <Route path="/traffic" element={<Traffic />} />
      </Routes>
    </Router>
  );
}

export default App;
