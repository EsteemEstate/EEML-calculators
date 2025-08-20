import React from "react";

function BreakEvenResults({ data }) {
  if (!data || data.noi === undefined || data.noi === null) {
    return (
      <div className="results-empty">
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

  // Formatting helpers
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
  const resultColor = isProfitable ? "positive-value" : "negative-value";

  return (
    <div className="results-container">
      <h2 className="results-header">Investment Analysis Summary</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className={`metric-card ${resultColor}`}>
          <div className="metric-content">
            <span className="metric-label">Net Operating Income</span>
            <span className="metric-value">{formatCurrency(noi)}</span>
          </div>
        </div>

        <div className={`metric-card ${resultColor}`}>
          <div className="metric-content">
            <span className="metric-label">Monthly Cash Flow</span>
            <span className="metric-value">{formatCurrency(cashFlow)}</span>
          </div>
        </div>

        <div className={`metric-card ${resultColor}`}>
          <div className="metric-content">
            <span className="metric-label">DSCR</span>
            <span className="metric-value">{dscr?.toFixed(2) ?? "N/A"}</span>
          </div>
        </div>

        <div className={`metric-card ${resultColor}`}>
          <div className="metric-content">
            <span className="metric-label">Break-Even Revenue</span>
            <span className="metric-value">
              {formatCurrency(breakEvenRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Results Grid */}
      <div className="detailed-results">
        <div className="result-row">
          <span className="result-label">Required Rent:</span>
          <span className="result-value">{formatCurrency(breakEvenRent)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Total Expenses:</span>
          <span className="result-value">
            {formatCurrency(
              totalOperatingExpenses?.total || totalOperatingExpenses
            )}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Mortgage Payment:</span>
          <span className="result-value">
            {formatCurrency(mortgagePayment?.regularPayment || mortgagePayment)}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Cap Rate:</span>
          <span className="result-value">{formatPercent(capRate * 100)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Cash-on-Cash ROI:</span>
          <span className="result-value">{formatPercent(cocROI * 100)}</span>
        </div>
      </div>

      {/* Investment Health */}
      <div
        className={`investment-health ${
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
