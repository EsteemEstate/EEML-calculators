// src/investment-calculators/HoldingCost/HoldingCostResults.jsx
import React from "react";
import HoldingCostCharts from "./HoldingCostCharts"; // implement charts separately

function HoldingCostResults({ results, currency = "USD" }) {
  if (!results || typeof results.monthlyHoldingCost === "undefined") {
    return (
      <div className="results-empty">
        No data to display. Please submit the form.
      </div>
    );
  }

  const {
    monthlyHoldingCost,
    annualHoldingCost,
    costPerSqFt,
    costPerDay,
    breakdown,
    netHoldingCost,
    effectiveHoldingCost,
    rentComparison,
    vacancySensitivity,
    interestRateSensitivity,
  } = results;

  // Formatting helpers
  const formatCurrency = (value) =>
    typeof value === "number"
      ? value.toLocaleString("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "N/A";

  const isPositive = netHoldingCost <= 0; // lower holding cost is positive
  const resultColor = isPositive ? "positive-value" : "negative-value";

  return (
    <div className="results-container">
      <h2 className="results-header">Property Holding Cost Analysis</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Monthly Holding Cost</span>
            <span className="metric-value">
              {formatCurrency(monthlyHoldingCost)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Annual Holding Cost</span>
            <span className="metric-value">
              {formatCurrency(annualHoldingCost)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Cost per Sq Ft</span>
            <span className="metric-value">{formatCurrency(costPerSqFt)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Cost per Day</span>
            <span className="metric-value">{formatCurrency(costPerDay)}</span>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="detailed-results">
        <h3>Cost Breakdown</h3>
        {breakdown &&
          Object.keys(breakdown).map((key) => (
            <div key={key} className="result-row">
              <span className="result-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <span className="result-value">
                {formatCurrency(breakdown[key])}
              </span>
            </div>
          ))}
      </div>

      {/* Verdict / Recommendation */}
      <div className={`investment-health ${resultColor}`}>
        <h3>Verdict</h3>
        {isPositive ? (
          <p>
            Your holding cost is manageable — property is financially
            sustainable.
          </p>
        ) : (
          <p>
            High holding costs detected — consider reducing expenses or offsets.
          </p>
        )}
      </div>

      {/* Charts */}
      <div className="charts">
        <HoldingCostCharts results={results} />
      </div>
    </div>
  );
}

export default HoldingCostResults;
