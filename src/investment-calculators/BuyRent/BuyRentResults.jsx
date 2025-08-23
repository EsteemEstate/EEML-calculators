// src/investment-calculators/BuyRent/BuyRentResults.jsx
import React from "react";
import BuyRentCharts from "./BuyRentCharts"; // make sure this exists

function BuyRentResults({ data }) {
  if (!data || typeof data.breakEvenYear === "undefined") {
    return (
      <div className="results-empty">
        No data to display. Please submit the form.
      </div>
    );
  }

  const {
    breakEvenYear,
    netWorthDelta,
    buyWealth,
    rentWealth,
    totalBuyCosts,
    totalRentCosts,
    investmentBuy,
    investmentRent,
    homeEquity,
    currency,
  } = data;

  // Formatting helpers
  const formatCurrency = (value) =>
    typeof value === "number"
      ? value.toLocaleString("en-US", {
          style: "currency",
          currency: currency || "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "N/A";

  const isPositive = netWorthDelta >= 0;
  const resultColor = isPositive ? "positive-value" : "negative-value";

  return (
    <div className="results-container">
      <h2 className="results-header">Buy vs Rent Analysis</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className={`metric-card`}>
          <div className="metric-content">
            <span className="metric-label">Break-even Year</span>
            <span className="metric-value">{breakEvenYear ?? "Never"}</span>
          </div>
        </div>

        <div className={`metric-card ${resultColor}`}>
          <div className="metric-content">
            <span className="metric-label">Net Worth Delta</span>
            <span className="metric-value">
              {formatCurrency(netWorthDelta)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Wealth if Buying</span>
            <span className="metric-value">{formatCurrency(buyWealth)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Wealth if Renting</span>
            <span className="metric-value">{formatCurrency(rentWealth)}</span>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="detailed-results">
        <div className="result-row">
          <span className="result-label">Total Costs (Buy):</span>
          <span className="result-value">{formatCurrency(totalBuyCosts)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Total Costs (Rent):</span>
          <span className="result-value">{formatCurrency(totalRentCosts)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Investment Value (Buy):</span>
          <span className="result-value">{formatCurrency(investmentBuy)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Investment Value (Rent):</span>
          <span className="result-value">{formatCurrency(investmentRent)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Home Equity (End of Horizon):</span>
          <span className="result-value">{formatCurrency(homeEquity)}</span>
        </div>
      </div>

      {/* Verdict / Recommendation */}
      <div
        className={`investment-health ${isPositive ? "positive" : "negative"}`}
      >
        <h3>Verdict</h3>

        {isPositive ? (
          <p>Buying leads to higher long-term wealth.</p>
        ) : (
          <p>Renting may be financially smarter in this scenario.</p>
        )}
      </div>

      {/* Charts */}
      <div className="charts">
        <BuyRentCharts data={data} />
      </div>
    </div>
  );
}

export default BuyRentResults;
