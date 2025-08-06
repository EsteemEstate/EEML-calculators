import React from "react";

function ROIResults({ data }) {
  if (!data || !data.roi)
    return (
      <div className="results-empty">
        No data to display. Please submit the form.
      </div>
    );

  const {
    totalROI,
    capRate,
    cashOnCash,
    annualCashFlow,
    monthlyCashFlow,
    appreciation,
    futureValue,
  } = data.roi;

  // Formatting helpers
  const formatPercent = (value) =>
    typeof value === "number" ? `${value.toFixed(2)}%` : "N/A";

  const formatCurrency = (value) =>
    typeof value === "number"
      ? value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "N/A";

  // Determine if the investment is profitable
  const isProfitable = annualCashFlow > 0;
  const roiColor = isProfitable ? "positive-value" : "negative-value";

  return (
    <div className="results-container">
      <h2 className="results-header">Investment Analysis Summary</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className={`metric-card ${roiColor}`}>
          <div className="metric-content">
            <span className="metric-label">Total ROI</span>
            <span className="metric-value">{formatPercent(totalROI)}</span>
          </div>
        </div>

        <div
          className={`metric-card ${
            annualCashFlow > 0 ? "positive-value" : "negative-value"
          }`}
        >
          <div className="metric-content">
            <span className="metric-label">Annual Cash Flow</span>
            <span className="metric-value">
              {formatCurrency(annualCashFlow)}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Results Grid */}
      <div className="detailed-results">
        <div className="result-row">
          <span className="result-label">
            Property Value in {data.holdingPeriod} Years:
          </span>
          <span className="result-value">{formatCurrency(futureValue)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Appreciation Gain:</span>
          <span className="result-value">{formatCurrency(appreciation)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Monthly Cash Flow:</span>
          <span className="result-value">
            {formatCurrency(monthlyCashFlow)}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Cap Rate:</span>
          <span className="result-value">{formatPercent(capRate)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Cash-on-Cash Return:</span>
          <span className="result-value">{formatPercent(cashOnCash)}</span>
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
          <p>
            This property shows positive cash flow and appreciation potential.
          </p>
        ) : (
          <p>
            Warning: Negative cash flow. This property relies heavily on
            appreciation.
            {appreciation > 0 && " Projected appreciation may offset losses."}
          </p>
        )}
      </div>
    </div>
  );
}

export default ROIResults;
