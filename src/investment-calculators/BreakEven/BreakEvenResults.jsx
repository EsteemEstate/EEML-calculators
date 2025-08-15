import React from "react";

function BreakEvenResults({ data }) {
  if (!data || !data.breakEvenUnits)
    return (
      <div className="results-empty">
        No data to display. Please submit the form.
      </div>
    );

  const {
    breakEvenUnits,
    breakEvenRevenue,
    monthlyCashFlow,
    NOI,
    DSCR,
    operatingExpenseRatio,
    paybackMonths,
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

  // Determine if break-even is achieved
  const isProfitable = monthlyCashFlow >= 0;
  const cfColor = isProfitable ? "positive-value" : "negative-value";

  return (
    <div className="results-container">
      <h2 className="results-header">Break-Even Analysis Summary</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className={`metric-card ${cfColor}`}>
          <div className="metric-content">
            <span className="metric-label">Break-Even Units</span>
            <span className="metric-value">{breakEvenUnits}</span>
          </div>
        </div>

        <div className={`metric-card ${cfColor}`}>
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
          <span className="result-label">Monthly Cash Flow:</span>
          <span className="result-value">
            {formatCurrency(monthlyCashFlow)}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Net Operating Income (NOI):</span>
          <span className="result-value">{formatCurrency(NOI)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">
            Debt Service Coverage Ratio (DSCR):
          </span>
          <span className="result-value">{formatPercent(DSCR)}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Operating Expense Ratio:</span>
          <span className="result-value">
            {formatPercent(operatingExpenseRatio)}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Payback Period (Months):</span>
          <span className="result-value">{paybackMonths}</span>
        </div>
      </div>

      {/* Break-Even Health */}
      <div
        className={`investment-health ${
          isProfitable ? "positive" : "negative"
        }`}
      >
        <h3>Break-Even Health</h3>
        {isProfitable ? (
          <p>
            Your property reaches break-even at the current revenue and
            occupancy assumptions.
          </p>
        ) : (
          <p>
            Warning: Break-even not yet achieved. Consider adjusting rent,
            occupancy, or expenses.
          </p>
        )}
      </div>
    </div>
  );
}

export default BreakEvenResults;
