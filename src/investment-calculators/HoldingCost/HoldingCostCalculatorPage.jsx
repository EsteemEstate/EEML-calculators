// src/investment-calculators/HoldingCost/HoldingCostCalculatorPage.jsx
import React, { useState } from "react";
import HoldingCostForm from "./HoldingCostForm";
import HoldingCostResults from "./HoldingCostResults";

const HoldingCostCalculatorPage = () => {
  const [results, setResults] = useState(null);

  const handleResults = (calculatedData) => {
    setResults(calculatedData); // store the results from the form
  };

  return (
    <div className="holdingcost-calculator-wrapper">
      <header className="calculator-header">
        <h1>EEML Property Holding Cost Calculator</h1>
        <p className="subtitle">
          Calculate the true monthly and annual cost of owning a property,
          including financing, taxes, insurance, maintenance, and opportunity
          costs — with optional rental offsets and sensitivity analysis.
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info / Guidance Column */}
        <aside className="info-column">
          <h2>What This Calculator Does</h2>
          <p>
            Owning property involves more than just a mortgage. This calculator
            factors in all recurring ownership costs, optional services,
            opportunity costs of equity, and potential rental income to give you
            a transparent picture of your holding costs.
          </p>

          <h4>Key Insights You’ll Get:</h4>
          <ul>
            <li>
              <strong>Monthly & Annual Costs:</strong> Mortgage + Taxes +
              Insurance + HOA + Utilities + Maintenance + more.
            </li>
            <li>
              <strong>Revenue Adjustments:</strong> Rental income and tax
              deductions applied against holding costs.
            </li>
            <li>
              <strong>Scenario Analysis:</strong> Sensitivity to vacancy, rate
              changes, and maintenance increases.
            </li>
            <li>
              <strong>Comparisons:</strong> Market rent vs. holding cost to
              evaluate investment performance.
            </li>
          </ul>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <HoldingCostForm setResults={handleResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <HoldingCostResults results={results} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Results Yet</h3>
              <p>Enter property details to calculate holding costs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoldingCostCalculatorPage;
