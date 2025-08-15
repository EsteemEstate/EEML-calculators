import React, { useState } from "react";
import CapRateForm from "./CrForm";
import CapRateResults from "./CrResults";
import CapRateChart from "./CrChart";
import "../../styles/CapRateCalculator.css";

const CapRateCalculatorPage = () => {
  const [results, setResults] = useState(null);

  return (
    <div className="caprate-calculator-wrapper">
      <header className="calculator-header">
        <h1>EEML Cap Rate Calculator</h1>
        <p className="subtitle">
          Evaluate your property's income potential and compare it to market
          benchmarks
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info Column */}
        <aside className="info-column">
          <h2>What is Cap Rate?</h2>
          <p>
            Cap Rate (Capitalization Rate) measures the expected return on a
            real estate investment based on its Net Operating Income (NOI) and
            current market value. It’s a key metric for comparing properties and
            assessing investment performance.
          </p>
          <h4>Formula:</h4>
          <p>
            <strong>Cap Rate = (NOI ÷ Property Value) × 100</strong>
          </p>
          <ul>
            <li>
              <strong>NOI (Net Operating Income):</strong> Total rental and
              other income − operating expenses
            </li>
            <li>
              <strong>Property Value:</strong> Purchase price or current market
              value
            </li>
          </ul>
          <h4>Why it matters:</h4>
          <p>
            A higher Cap Rate generally means higher returns but may also
            indicate higher risk. Investors often compare Cap Rates against
            market averages to make informed decisions.
          </p>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <CapRateForm setResults={setResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <>
              <CapRateResults data={results} />
              <div className="chart-grid">
                <div className="chart-wrapper">
                  <CapRateChart data={results} />
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to see your Cap Rate analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapRateCalculatorPage;
