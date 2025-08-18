// =============================
// File: FlipProfitCalculatorPage.jsx
// =============================
import React, { useState, useEffect } from "react";
import FlipProfitForm from "./FlipProfitForm";
import FlipProfitResults from "./FlipProfitResults";
import "../../styles/FlipProfitCalculator.css";

const FlipProfitCalculatorPage = () => {
  const [results, setResults] = useState(null);

  // Add this useEffect to debug state changes
  useEffect(() => {
    console.log("Results state updated:", results);
  }, [results]);

  return (
    <div className="calculator-wrapper">
      <header className="calculator-header">
        <h1>EEML Flip Profit Calculator</h1>
        <p className="subtitle">
          Model acquisition → rehab → hold → sale with multiple financing
          options and bank-ready outputs.
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info Column */}
        <aside className="info-column">
          <h2>What does this calculator do?</h2>
          <p>
            It calculates flip profitability including acquisition, rehab (with
            contingency), holding costs, financing structure (interest-only or
            amortized; optional rehab draws), and sale costs. Outputs include
            Net Profit, ROI, Annualized ROI, Break-even Sale Price, profit
            curve, cashflow timeline, cost stack, sensitivity, and ROI vs LTV.
          </p>
          <h4>Core Profit Equation</h4>
          <p>
            <strong>
              Profit = (Sale Price − Sale Costs − Loan Payoff) − (Acquisition
              Cash + Total Holding Cash)
            </strong>
          </p>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <FlipProfitForm setResults={setResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <FlipProfitResults data={results} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏗️</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to see your flip analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipProfitCalculatorPage;
