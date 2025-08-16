import React from "react";

function BreakEvenResults({ data }) {
  if (!data || data.noi === undefined || data.noi === null) {
    return (
      <div className="break-even-empty">
        No data to display. Please submit the form.
      </div>
    );
  }

  const {
    noi,
    cashFlow,
    breakEvenRevenue,
    breakEvenRent,
    totalOperatingExpenses,
    mortgagePayment,
    dscr,
    capRate,
    cocROI,
  } = data;

  const formatCurrency = (value) =>
    typeof value === "number"
      ? value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "N/A";

  const formatPercent = (value) =>
    typeof value === "number" ? `${value.toFixed(2)}%` : "N/A";

  const isProfitable = cashFlow > 0;

  return (
    <div className="break-even-results">
      <h2 className="results-header">Investment Analysis Summary</h2>

      {/* Key Metrics Cards */}
      <div className="be-metrics-cards">
        <div
          className={`be-metric-card ${
            isProfitable ? "positive-value" : "negative-value"
          }`}
        >
          <div className="metric-content">
            <span className="be-metric-label">Net Operating Income</span>
            <span className="be-metric-value">{formatCurrency(noi)}</span>
          </div>
        </div>

        <div
          className={`be-metric-card ${
            isProfitable ? "positive-value" : "negative-value"
          }`}
        >
          <div className="metric-content">
            <span className="be-metric-label">Monthly Cash Flow</span>
            <span className="be-metric-value">{formatCurrency(cashFlow)}</span>
          </div>
        </div>

        <div
          className={`be-metric-card ${
            isProfitable ? "positive-value" : "negative-value"
          }`}
        >
          <div className="metric-content">
            <span className="be-metric-label">DSCR</span>
            <span className="be-metric-value">{dscr.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="be-detailed-results">
        <div className="be-result-row">
          <span className="be-result-label">Break-Even Revenue:</span>
          <span className="be-result-value">
            {formatCurrency(breakEvenRevenue)}
          </span>
        </div>
        <div className="be-result-row">
          <span className="be-result-label">Required Rent:</span>
          <span className="be-result-value">
            {formatCurrency(breakEvenRent)}
          </span>
        </div>
        <div className="be-result-row">
          <span className="be-result-label">Total Expenses:</span>
          <span className="be-result-value">
            {formatCurrency(
              totalOperatingExpenses?.total || totalOperatingExpenses
            )}
          </span>
        </div>
        <div className="be-result-row">
          <span className="be-result-label">Mortgage Payment:</span>
          <span className="be-result-value">
            {formatCurrency(mortgagePayment?.regularPayment || mortgagePayment)}
          </span>
        </div>
      </div>

      {/* ROI Metrics */}
      <div className="be-detailed-results">
        <div className="be-result-row">
          <span className="be-result-label">Cap Rate:</span>
          <span className="be-result-value">
            {formatPercent(capRate * 100)}
          </span>
        </div>
        <div className="be-result-row">
          <span className="be-result-label">Cash-on-Cash ROI:</span>
          <span className="be-result-value">{formatPercent(cocROI * 100)}</span>
        </div>
      </div>

      {/* Investment Health */}
      <div
        className={`break-even-health ${
          isProfitable ? "positive" : "negative"
        }`}
      >
        <h3>Investment Health</h3>
        {isProfitable ? (
          <p>This property is profitable based on current inputs.</p>
        ) : (
          <p>
            Warning: The property is not currently profitable with these inputs.
          </p>
        )}
      </div>
    </div>
  );
}

export default BreakEvenResults;
