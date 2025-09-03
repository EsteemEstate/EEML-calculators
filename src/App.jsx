import React, { useState } from "react";
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
import RenovationCalculatorPage from "./investment-calculators/ReturnOnRenovation/ReturnOnRenovationCalculatorPage";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const calculators = [
    { path: "/roi", name: "ROI Calculator" },
    { path: "/rental-yield", name: "Rental Yield Calculator" },
    { path: "/cap-rate", name: "Cap Rate Calculator" },
    { path: "/break-even", name: "Break-Even Calculator" },
    { path: "/flip-profit", name: "Flip Profit Calculator" },
    { path: "/buy-vs-rent", name: "Buy vs Rent Calculator" },
    { path: "/holding-cost", name: "Holding Cost Calculator" },
    { path: "/equity-growth", name: "Equity Growth Calculator" },
    { path: "/portfolio-analyzer", name: "Portfolio Analyzer" },
    { path: "/renovation", name: "Renovation ROI Calculator" },
  ];

  const filteredCalculators = calculators.filter((calc) =>
    calc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-link home-link">
            Home
          </Link>

          {/* Investment Calculators Dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link to="#" className="nav-link">
              Investment Calculators ▾
            </Link>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {calculators.map((calc) => (
                  <Link
                    key={calc.path}
                    to={calc.path}
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {calc.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 🔍 Search Bar Container */}
          <div
            className={`search-container ${isSearchFocused ? "focused" : ""}`}
          >
            <svg
              className="search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              className="nav-search"
              placeholder="Search calculators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Search Results Dropdown */}
            {searchTerm && filteredCalculators.length > 0 && (
              <div className="search-results">
                <div className="search-results-header">
                  <span>Matching Calculators</span>
                  <span className="results-count">
                    {filteredCalculators.length} found
                  </span>
                </div>
                {filteredCalculators.map((calc) => (
                  <Link
                    key={calc.path}
                    to={calc.path}
                    className="search-result-item"
                    onClick={() => setSearchTerm("")}
                  >
                    {calc.name}
                  </Link>
                ))}
              </div>
            )}

            {/* No Results Message */}
            {searchTerm && filteredCalculators.length === 0 && (
              <div className="search-results">
                <div className="no-results">
                  No calculators found for "{searchTerm}"
                </div>
              </div>
            )}
          </div>
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
            <Route path="/renovation" element={<RenovationCalculatorPage />} />
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
