import React from "react";
import { formatPercent, formatCurrency } from "../../Utils/formatHelpers"; // Ensure this helper file exists for formatting functions

const RentalYieldResults = ({ results }) => {
  if (!results) {
    return (
      <div className="results-empty">
        No data to display. Please submit the form.
      </div>
    );
  }

  // Destructure results
  const {
    grossYield,
    netYield,
    capRate,
    cashOnCash,
    annualRent,
    totalIncome,
    expenses,
    cashFlow,
    paybackPeriod,
  } = results;

  // Determine if the investment is profitable
  const isProfitable = cashFlow > 0;
  const roiColor = isProfitable ? "positive-value" : "negative-value";

  return (
    <div className="results-container">
      <h2 className="results-header">Rental Yield Analysis Summary</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className={`metric-card ${roiColor}`}>
          <div className="metric-content">
            <span className="metric-label">Gross Rental Yield</span>
            <span className="metric-value">{formatPercent(grossYield)}</span>
          </div>
        </div>

        <div className={`metric-card ${roiColor}`}>
          <div className="metric-content">
            <span className="metric-label">Net Rental Yield</span>
            <span className="metric-value">{formatPercent(netYield)}</span>
          </div>
        </div>

        <div className={`metric-card ${roiColor}`}>
          <div className="metric-content">
            <span className="metric-label">Cap Rate</span>
            <span className="metric-value">{formatPercent(capRate)}</span>
          </div>
        </div>

        <div className={`metric-card ${roiColor}`}>
          <div className="metric-content">
            <span className="metric-label">Cash-on-Cash Return</span>
            <span className="metric-value">{formatPercent(cashOnCash)}</span>
          </div>
        </div>
      </div>

      {/* Detailed Results Grid */}
      <div className="detailed-results">
        <div className="result-row">
          <span className="result-label">Annual Rental Income:</span>
          <span className="result-value">{formatCurrency(annualRent)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Total Income:</span>
          <span className="result-value">{formatCurrency(totalIncome)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Total Expenses:</span>
          <span className="result-value">{formatCurrency(expenses)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Annual Cash Flow:</span>
          <span className="result-value">{formatCurrency(cashFlow)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Payback Period:</span>
          <span className="result-value">
            {paybackPeriod !== null
              ? paybackPeriod.toFixed(2) + " years"
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Investment Health */}
      <div className={`investment-health ${roiColor}`}>
        <h3>Investment Health</h3>
        {isProfitable ? (
          <p>
            This property shows positive cash flow and potential for growth.
          </p>
        ) : (
          <p>
            Warning: Negative cash flow. This property may rely heavily on
            appreciation.
          </p>
        )}
      </div>
    </div>
  );
};

export default RentalYieldResults;
