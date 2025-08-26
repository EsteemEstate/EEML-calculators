// PortfolioAnalyzerPage.jsx
import React, { useState } from "react";
import PortfolioForm from "./PortfolioForm";
import PortfolioResults from "./PortfolioResults";

const PortfolioAnalyzerPage = () => {
  const [results, setResults] = useState(null);

  const handleResults = (calculatedData) => {
    setResults(calculatedData);
  };

  return (
    <div className="portfolio-analyzer-wrapper">
      <header className="calculator-header">
        <h1>EEML Real Estate Portfolio Analyzer</h1>
        <p className="subtitle">
          Track your multi-property portfolio’s performance, equity, cashflow,
          and risk.
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info Column */}
        <aside className="info-column">
          <h2>Why Use This Analyzer?</h2>
          <p>
            Evaluate multiple properties together, understand cashflow, debt,
            risk, and visualize portfolio performance over time.
          </p>
          <h4>Key Considerations:</h4>
          <ul>
            <li>
              <strong>Property Inputs:</strong> Purchase price, type, rent,
              mortgage, and expenses
            </li>
            <li>
              <strong>Portfolio Metrics:</strong> Equity, NOI, cash-on-cash
              return, DSCR, cap rates
            </li>
            <li>
              <strong>Risk Analysis:</strong> Sensitivity tests, concentration
              by type/location
            </li>
            <li>
              <strong>Exit & Sale:</strong> Project portfolio IRR, exit equity,
              payback for CapEx
            </li>
          </ul>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <PortfolioForm setResults={handleResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <PortfolioResults data={results} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏘️</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to analyze your real estate portfolio</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalyzerPage;
