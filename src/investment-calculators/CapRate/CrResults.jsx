import React from "react";

function CrResults({ data }) {
  if (!data || !data.NOI)
    return (
      <div className="results-empty">
        No data to display. Please submit the form.
      </div>
    );

  const {
    NOI,
    grossScheduledIncome,
    effectiveGrossIncome,
    totalOperatingExpenses,
    goingInCapRate,
    effectiveCapRate,
    stabilizedCapRate,
    exitCapRateValue,
    breakEvenOccupancy,
    expenseRatio,
  } = data;

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

  // Determine if NOI is positive
  const isProfitable = NOI > 0;
  const capRateColor = isProfitable ? "positive-value" : "negative-value";

  return (
    <div className="results-container">
      <h2 className="results-header">Cap Rate Analysis Summary</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className={`metric-card ${capRateColor}`}>
          <div className="metric-content">
            <span className="metric-label">Going-In Cap Rate</span>
            <span className="metric-value">
              {formatPercent(goingInCapRate)}
            </span>
          </div>
        </div>

        <div className={`metric-card ${capRateColor}`}>
          <div className="metric-content">
            <span className="metric-label">Effective Cap Rate</span>
            <span className="metric-value">
              {formatPercent(effectiveCapRate)}
            </span>
          </div>
        </div>

        <div className={`metric-card ${capRateColor}`}>
          <div className="metric-content">
            <span className="metric-label">Stabilized Cap Rate</span>
            <span className="metric-value">
              {formatPercent(stabilizedCapRate)}
            </span>
          </div>
        </div>

        <div className={`metric-card ${capRateColor}`}>
          <div className="metric-content">
            <span className="metric-label">Exit Cap Rate</span>
            <span className="metric-value">
              {formatPercent(exitCapRateValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Results Grid */}
      <div className="detailed-results">
        <div className="result-row">
          <span className="result-label">Net Operating Income (NOI):</span>
          <span className="result-value">{formatCurrency(NOI)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Gross Scheduled Income:</span>
          <span className="result-value">
            {formatCurrency(grossScheduledIncome)}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Effective Gross Income:</span>
          <span className="result-value">
            {formatCurrency(effectiveGrossIncome)}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Total Operating Expenses:</span>
          <span className="result-value">
            {formatCurrency(totalOperatingExpenses)}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Break-even Occupancy:</span>
          <span className="result-value">
            {formatPercent(breakEvenOccupancy)}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Expense Ratio:</span>
          <span className="result-value">{formatPercent(expenseRatio)}</span>
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
            This property has a positive Net Operating Income and is generating
            returns above zero. Compare the cap rates to market averages to
            evaluate competitiveness.
          </p>
        ) : (
          <p>
            Warning: The Net Operating Income is negative. This property may
            require expense reduction or income growth to be viable.
          </p>
        )}
      </div>
    </div>
  );
}

export default CrResults;
