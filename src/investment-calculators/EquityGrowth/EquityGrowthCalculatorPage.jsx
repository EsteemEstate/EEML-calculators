// EquityGrowthCalculatorPage.jsx
import React, { useState } from "react";
import EquityGrowthForm from "./EquityGrowthForm";
import EquityGrowthResults from "./EquityGrowthResults";

const EquityGrowthCalculatorPage = () => {
  const [results, setResults] = useState(null);

  const handleResults = (calculatedData) => {
    setResults(calculatedData);
  };

  return (
    <div className="equity-growth-calculator-wrapper">
      <header className="calculator-header">
        <h1>EEML Equity Growth Calculator</h1>
        <p className="subtitle">
          Project your property or portfolio equity over time, including
          financing, appreciation, and optional rental income.
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info Column */}
        <aside className="info-column">
          <h2>Why Use This Calculator?</h2>
          <p>
            Track your equity growth over time for better financial planning.
            Factor in loans, renovations, market appreciation, and optional
            rental income.
          </p>

          <h4>Key Considerations:</h4>
          <ul>
            <li>
              <strong>Property Inputs:</strong> Purchase price, down payment,
              and market assumptions.
            </li>
            <li>
              <strong>Financing:</strong> Mortgages, extra payments, HELOCs,
              refinancing events.
            </li>
            <li>
              <strong>Costs:</strong> Taxes, insurance, HOA, maintenance,
              vacancy, etc.
            </li>
            <li>
              <strong>Equity Drivers:</strong> Appreciation, renovations,
              principal repayment.
            </li>
          </ul>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <EquityGrowthForm setResults={handleResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <>
              <EquityGrowthResults data={results} />
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📈</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to project your equity growth</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquityGrowthCalculatorPage;
