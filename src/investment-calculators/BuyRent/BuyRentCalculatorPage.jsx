// BuyRentCalculatorPage.jsx
import React, { useState } from "react";
import BuyRentForm from "./BuyRentForm";
import BuyRentResults from "./BuyRentResults";

const BuyRentCalculatorPage = () => {
  const [results, setResults] = useState(null);

  const handleResults = (calculatedData) => {
    setResults(calculatedData);
  };

  return (
    <div className="buyrent-calculator-wrapper">
      <header className="calculator-header">
        <h1>EEML Buy vs Rent Calculator</h1>
        <p className="subtitle">
          Compare the long-term costs and benefits of buying a home versus
          renting one.
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info Column */}
        <aside className="info-column">
          <h2>Why Use This Calculator?</h2>
          <p>
            Deciding whether to buy or rent a home is one of the biggest
            financial decisions you'll ever make. This calculator helps you
            compare both options over time, factoring in costs, equity, and
            potential gains.
          </p>

          <h4>Key Considerations:</h4>
          <ul>
            <li>
              <strong>Upfront Costs:</strong> Down payment, closing costs, and
              fees.
            </li>
            <li>
              <strong>Ongoing Costs:</strong> Mortgage, rent, insurance, taxes,
              and maintenance.
            </li>
            <li>
              <strong>Equity:</strong> Buying builds ownership value, while rent
              does not.
            </li>
            <li>
              <strong>Flexibility:</strong> Renting offers mobility with fewer
              commitments.
            </li>
          </ul>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <BuyRentForm setResults={handleResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <>
              <BuyRentResults data={results} />

              {/* Charts Section */}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to compare buying vs renting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyRentCalculatorPage;
