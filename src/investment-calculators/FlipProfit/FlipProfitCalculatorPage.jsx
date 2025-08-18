// =============================
// File: FlipProfitCalculatorPage.jsx
// =============================
import React, { useState } from "react";
import FlipProfitForm from "./FlipProfitForm";
import FlipProfitResults from "./FlipProfitResults";
import "../../styles/FlipProfitCalculator.css";

/******************** Page ********************/
const FlipProfitCalculatorPage = () => {
  const [results, setResults] = useState(null);

  return (
    <div className="roi-calculator-wrapper">
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
            <>
              <FlipProfitResults data={results} />

              <div className="chart-row">
                <div className="chart-wrapper full-width">
                  <ProfitCurveChart data={results} />
                </div>
              </div>

              <div className="chart-row">
                <CashFlowTimelineChart data={results} />
                <CostWaterfallChart data={results} />
              </div>

              <div className="chart-row">
                <SensitivityTornadoChart data={results} />
                <LeverageEquityChart data={results} />
              </div>
            </>
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
