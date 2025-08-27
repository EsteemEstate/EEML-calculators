import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ROICalculatorPage from "./investment-calculators/ROI/ROICalculatorPage";
import RentalYieldCalculatorPage from "./investment-calculators/RentalYield/RentalYieldCalculatorPage";
import CapRateCalculatorPage from "./investment-calculators/CapRate/CapRateCalculatorPage";
import BECalculatorPage from "./investment-calculators/BreakEven/BECalculatorPage";
import FlipProfitCalculatorPage from "./investment-calculators/FlipProfit/FlipProfitCalculatorPage";
import BuyRentCalculatorPage from "./investment-calculators/BuyRent/BuyRentCalculatorPage";
import HoldingCostCalculatorPage from "./investment-calculators/HoldingCost/HoldingCostCalculatorPage";
import EquityGrowthCalculatorPage from "./investment-calculators/EquityGrowth/EquityGrowthCalculatorPage";
import PortfolioAnalyzerPage from "./investment-calculators/PortfolioAnalyzer/PortfolioAnalyzerPage";
import RenovationCalculatorPage from "./investment-calculators/ReturnOnRenovation/ReturnOnRenovationCalculatorPage"; // ✅ NEW IMPORT

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
          <span className="nav-divider">|</span>
          <Link to="/cap-rate" className="nav-link">
            Cap Rate Calculator
          </Link>
          <span className="nav-divider">|</span>
          <Link to="/break-even" className="nav-link">
            Break-Even Calculator
          </Link>
          <span className="nav-divider">|</span>
          <Link to="/flip-profit" className="nav-link">
            Flip Profit Calculator
          </Link>
          <span className="nav-divider">|</span>
          <Link to="/buy-vs-rent" className="nav-link">
            Buy vs Rent Calculator
          </Link>
          <span className="nav-divider">|</span>
          <Link to="/holding-cost" className="nav-link">
            Holding Cost Calculator
          </Link>
          <span className="nav-divider">|</span>
          <Link to="/equity-growth" className="nav-link">
            Equity Growth Calculator
          </Link>

          <span className="nav-divider">|</span>
          <Link to="/portfolio-analyzer" className="nav-link">
            Portfolio Analyzer
          </Link>
          <span className="nav-divider">|</span>
          <Link to="/renovation" className="nav-link">
            Renovation ROI Calculator
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
            <Route path="/cap-rate" element={<CapRateCalculatorPage />} />
            <Route path="/break-even" element={<BECalculatorPage />} />
            <Route path="/flip-profit" element={<FlipProfitCalculatorPage />} />
            <Route path="/buy-vs-rent" element={<BuyRentCalculatorPage />} />
            <Route
              path="/holding-cost"
              element={<HoldingCostCalculatorPage />}
            />
            <Route
              path="/equity-growth"
              element={<EquityGrowthCalculatorPage />}
            />
            <Route path="/renovation" element={<RenovationCalculatorPage />} />{" "}
            {/* ✅ NEW ROUTE */}
            <Route
              path="/portfolio-analyzer"
              element={<PortfolioAnalyzerPage />}
            />
          </Routes>
        </main>

        <footer>
          <p className="footer-text">
            © {new Date().getFullYear()} Esteem Estate Management LTD
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
