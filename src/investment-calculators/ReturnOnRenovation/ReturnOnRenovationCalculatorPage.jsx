// src/investment-calculators/Renovation/ReturnOnRenovationCalculatorPage.jsx
import React, { useState } from "react";
import ReturnOnRenovationForm from "./ReturnOnRenovationForm";
import ReturnOnRenovationResults from "./ReturnOnRenovationResults";
import "../../styles/ReturnOnRenovationCalculator.css";

const ReturnOnRenovationCalculatorPage = () => {
  const [results, setResults] = useState(null);

  const handleResults = (calculatedData) => {
    setResults(calculatedData);
  };

  return (
    <div className="renovation-calculator-wrapper">
      <header className="calculator-header">
        <h1>Return on Renovation Calculator</h1>
        <p className="subtitle">
          Estimate the return on your property renovation projects by factoring
          in renovation costs, after-repair value, and financing.
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info Column */}
        <aside className="info-column">
          <h2>Why Use This Calculator?</h2>
          <p>
            Understand the potential financial impact of renovations. Compare
            the investment in upgrades against projected value increases to make
            informed decisions.
          </p>

          <h4>Key Considerations:</h4>
          <ul>
            <li>
              <strong>Renovation Costs:</strong> Material, labor, and contractor
              fees.
            </li>
            <li>
              <strong>After-Repair Value (ARV):</strong> Projected market value
              after renovations.
            </li>
            <li>
              <strong>Financing:</strong> Loans or equity used for renovations.
            </li>
            <li>
              <strong>Return Metrics:</strong> ROI, profit, and payback period.
            </li>
            <li>
              <strong>Valuation Methods:</strong> Appraisal vs. income-based
              approaches.
            </li>
            <li>
              <strong>Risk Analysis:</strong> Cost overruns and value
              uncertainties.
            </li>
          </ul>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <ReturnOnRenovationForm setResults={handleResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <ReturnOnRenovationResults data={results} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🛠️</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to calculate your renovation return.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnOnRenovationCalculatorPage;
