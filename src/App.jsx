import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ROICalculatorPage from "./calculators/ROI/ROICalculatorPage";
import { Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/roi">ROI Calculator</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to EEML Calculators</h1>} />
        <Route path="/roi" element={<ROICalculatorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
