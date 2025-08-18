// src/investment-calculators/FlipProfit/FlipProfitResults.jsx
import React from "react";

function FlipProfitResults({ data }) {
  if (!data || typeof data.netProfit === "undefined") {
    return (
      <div className="empty-results">
        <h3>No results yet</h3>
        <p>
          Enter your property details and click calculate to see your flip
          analysis.
        </p>
      </div>
    );
  }

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

  const isProfitable = data.netProfit > 0;
  const roiClass = isProfitable ? "positive-value" : "negative-value";

  return (
    <div className="results-container">
      <h2 className="results-header">Flip Analysis Summary</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className={`metric-card ${roiClass}`}>
          <div className="metric-content">
            <span className="metric-label">Net Profit</span>
            <span className="metric-value">
              {formatCurrency(data.netProfit)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">ROI</span>
            <span className={`metric-value ${roiClass}`}>
              {formatPercent(data.roi)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Annualized ROI</span>
            <span className={`metric-value ${roiClass}`}>
              {formatPercent(data.annualizedRoi)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Break-Even Sale Price</span>
            <span className="metric-value">
              {formatCurrency(data.breakEvenSalePrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Results Grid */}
      <div className="detailed-results">
        <div className="result-row">
          <span className="result-label">Total Project Cost:</span>
          <span className="result-value">
            {formatCurrency(data.totalProjectCost)}
          </span>
        </div>
        <div className="result-row">
          <span className="result-label">Cash Invested (Equity):</span>
          <span className="result-value">
            {formatCurrency(data.totalCashInvested)}
          </span>
        </div>
        <div className="result-row">
          <span className="result-label">Loan Payoff at Sale:</span>
          <span className="result-value">
            {formatCurrency(data.payoffBalance)}
          </span>
        </div>
        <div className="result-row">
          <span className="result-label">Sale Costs (incl. commission):</span>
          <span className="result-value">{formatCurrency(data.saleCosts)}</span>
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
            ✅ Profitable based on inputs. Review sensitivity to confirm risk
            bands.
          </p>
        ) : (
          <p>
            ⚠️ Negative outcome under current assumptions. Consider higher ARV,
            lower rehab, shorter hold, or cheaper financing.
          </p>
        )}
      </div>
    </div>
  );
}

export default FlipProfitResults;
