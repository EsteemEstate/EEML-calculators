import React from "react";

const RentalYieldResults = ({ results }) => {
  return (
    <div className="results-container">
      <h3>Results</h3>
      <div className="result-item">
        <span>Gross Rental Yield:</span>
        <span>{results.grossYield}%</span>
      </div>
      <div className="result-item">
        <span>Net Rental Yield:</span>
        <span>{results.netYield}%</span>
      </div>
      <div className="result-item">
        <span>Cap Rate:</span>
        <span>{results.capRate}%</span>
      </div>
      <div className="result-item">
        <span>Cash-on-Cash Return:</span>
        <span>{results.cashOnCash}%</span>
      </div>
      <div className="result-item">
        <span>Annual Rental Income:</span>
        <span>${results.annualRent}</span>
      </div>
      <div className="result-item">
        <span>Total Income:</span>
        <span>${results.totalIncome}</span>
      </div>
      <div className="result-item">
        <span>Total Expenses:</span>
        <span>${results.expenses}</span>
      </div>
      <div className="result-item">
        <span>Annual Cash Flow:</span>
        <span>${results.cashFlow}</span>
      </div>
      <div className="result-item">
        <span>Payback Period:</span>
        <span>{results.paybackPeriod}</span>
      </div>
    </div>
  );
};

export default RentalYieldResults;
