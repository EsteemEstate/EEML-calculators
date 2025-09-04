// src/investment-calculators/Mortgage/MortgageCalculatorPage.jsx
import React, { useState } from "react";
import MortgageForm from "./MortgageForm";
import MortgageResults from "./MortgageResults";
import "../../F&A styles/MortgageCalculator.css";

const MortgageCalculatorPage = () => {
  const [results, setResults] = useState(null);

  const handleResults = (calculatedData) => {
    setResults(calculatedData);
  };

  return (
    <div className="mortgage-calculator-wrapper">
      <header className="calculator-header">
        <h1>Mortgage Calculator</h1>
        <p className="subtitle">
          Estimate your monthly mortgage payments, loan summary, and payoff
          timeline based on property details, interest rates, and loan terms.
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info Column */}
        <aside className="info-column">
          <h2>Why Use This Calculator?</h2>
          <p>
            A mortgage is one of the largest financial commitments you’ll make.
            This calculator helps you plan ahead by showing a full breakdown of
            monthly payments and long-term costs.
          </p>

          <h4>Key Considerations:</h4>
          <ul>
            <li>
              <strong>Home Price:</strong> The total purchase price of the
              property.
            </li>
            <li>
              <strong>Down Payment:</strong> Either a percentage or dollar
              amount.
            </li>
            <li>
              <strong>Loan Term:</strong> The length of time (e.g., 15, 20, 30
              years).
            </li>
            <li>
              <strong>Interest Rate:</strong> Annual mortgage rate applied to
              the loan.
            </li>
            <li>
              <strong>Taxes & Insurance:</strong> Estimated annual property
              taxes and homeowners insurance.
            </li>
            <li>
              <strong>PMI & HOA Fees:</strong> Private mortgage insurance and
              monthly HOA fees if applicable.
            </li>
          </ul>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <MortgageForm setResults={handleResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <MortgageResults data={results} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏡</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to calculate your mortgage payments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculatorPage;
