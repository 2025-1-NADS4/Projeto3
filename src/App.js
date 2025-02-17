import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Feedbacks from "./Pages/Feedbacks";  // importe o componente Feedbacks

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedbacks" element={<Feedbacks />} />  {/* nova rota */}
      </Routes>
    </Router>
  );
}

export default App;
