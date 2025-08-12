import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ROICalculatorPage from "./investment-calculators/ROI/ROICalculatorPage";
import RentalYieldCalculatorPage from "./investment-calculators/RentalYield/RentalYieldCalculatorPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <span className="nav-divider">|</span>
          <Link to="/roi" className="nav-link">
            ROI Calculator
          </Link>
          <span className="nav-divider">|</span>
          <Link to="/rental-yield" className="nav-link">
            Rental Yield Calculator
          </Link>
        </nav>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="hero">
                  <h1 className="hero-title">Welcome to EEML Calculators</h1>
                  <p className="hero-subtitle">
                    Precision tools for your financial analysis
                  </p>
                </div>
              }
            />
            <Route path="/roi" element={<ROICalculatorPage />} />
            <Route
              path="/rental-yield"
              element={<RentalYieldCalculatorPage />}
            />
          </Routes>
        </main>

        <footer>
          <p className="footer-text">
            © {new Date().getFullYear()} Esteem Estate Managemnet LTD
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
