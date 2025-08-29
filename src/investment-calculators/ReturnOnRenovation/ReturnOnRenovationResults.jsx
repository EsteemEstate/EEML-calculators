// src/investment-calculators/RenovationROI/RenovationROIResults.jsx
import React from "react";
import ReturnOnRenovationCharts from "./ReturnOnRenovationCharts";

function RenovationROIResults({ data }) {
  if (!data) {
    return (
      <div className="results-empty">
        No data to display. Please submit the form.
      </div>
    );
  }

  const {
    renovationCost,
    valueIncrease,
    newValue,
    equityCreated,
    roiPercent,
    annualizedROI,
    monthlyRentIncrease,
    paybackYears,
    valuationMethods,
    breakdown,
  } = data;

  // Format helpers
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
    typeof value === "number" ? `${value.toFixed(1)}%` : "N/A";

  const isPositive = roiPercent >= 0;
  const resultColor = isPositive ? "positive-value" : "negative-value";

  return (
    <div className="results-container">
      <h2 className="results-header">Renovation ROI Analysis</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Total Investment</span>
            <span className="metric-value">
              {formatCurrency(renovationCost)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Value Added</span>
            <span className="metric-value">
              {formatCurrency(valueIncrease)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">New Property Value</span>
            <span className="metric-value">{formatCurrency(newValue)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Net Equity Gain</span>
            <span className="metric-value">
              {formatCurrency(equityCreated)}
            </span>
          </div>
        </div>

        <div className={`metric-card ${resultColor}`}>
          <div className="metric-content">
            <span className="metric-label">ROI</span>
            <span className="metric-value">{formatPercent(roiPercent)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Annualized ROI</span>
            <span className="metric-value">
              {formatPercent(annualizedROI * 100)}
            </span>
          </div>
        </div>

        {monthlyRentIncrease > 0 && (
          <>
            <div className="metric-card">
              <div className="metric-content">
                <span className="metric-label">Monthly Rent Increase</span>
                <span className="metric-value">
                  {formatCurrency(monthlyRentIncrease)}
                </span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-content">
                <span className="metric-label">Payback Period</span>
                <span className="metric-value">
                  {paybackYears ? `${paybackYears.toFixed(1)} years` : "N/A"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="detailed-results">
        <div className="result-row">
          <span className="result-label">Valuation Method Used:</span>
          <span className="result-value">{valuationMethods?.used}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Appraisal Method:</span>
          <span className="result-value">
            {formatCurrency(valuationMethods?.appraisal)}
          </span>
        </div>
        <div className="result-row">
          <span className="result-label">Income Method:</span>
          <span className="result-value">
            {formatCurrency(valuationMethods?.income)}
          </span>
        </div>
      </div>

      {/* Cost Breakdown */}
      {breakdown && breakdown.length > 0 && (
        <div className="detailed-results">
          <h3>Cost Breakdown</h3>
          {breakdown.map((item, index) => (
            <div key={index} className="result-row">
              <span className="result-label">
                {item.label || `Item ${index + 1}`}
              </span>
              <span className="result-value">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Verdict */}
      <div
        className={`investment-health ${isPositive ? "positive" : "negative"}`}
      >
        <h3>Verdict</h3>
        {isPositive ? (
          <p>This renovation shows positive ROI potential.</p>
        ) : (
          <p>
            This renovation may not be financially viable based on current
            inputs.
          </p>
        )}
      </div>

      {/* Charts */}
      <div className="charts">
        <ReturnOnRenovationCharts data={data} />
      </div>
    </div>
  );
}

export default RenovationROIResults;
