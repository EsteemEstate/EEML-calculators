// src/investment-calculators/RenovationROI/RenovationROIResults.jsx
import React from "react";
import ReturnOnRenovationCharts from "./ReturnOnRenovationCharts";

function RenovationROIResults({ data }) {
  if (!data) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛠️</div>
        <h3>No Data Available</h3>
        <p>Please submit your renovation inputs to generate results.</p>
      </div>
    );
  }

  const {
    currentValue,
    renovationCost,
    valueIncrease,
    newValue,
    equityCreated,
    roiPercent,
    annualRentGain,
    monthlyRentIncrease,
    paybackYears,
    netGainAfterSale,
    annualizedROI,
    breakdown,
    valuationMethods,
  } = data;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatPercent = (value) =>
    typeof value === "number" ? `${value.toFixed(1)}%` : "N/A";

  const isProfitable = roiPercent > 0;
  const healthColor = isProfitable ? "positive" : "negative";
  const healthMessage = isProfitable
    ? "This renovation shows positive ROI potential."
    : "This renovation may not be financially viable based on current inputs.";

  return (
    <div className="results-container">
      <h2 className="results-header">Renovation ROI Analysis</h2>

      {/* Investment Health */}
      <div className={`investment-health ${healthColor}`}>
        <h3>Investment Health</h3>
        <p>{healthMessage}</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total Investment</span>
          <span className="metric-value">{formatCurrency(renovationCost)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Value Added</span>
          <span className="metric-value">{formatCurrency(valueIncrease)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">New Property Value</span>
          <span className="metric-value">{formatCurrency(newValue)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Net Equity Gain</span>
          <span className="metric-value">{formatCurrency(equityCreated)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">ROI</span>
          <span className="metric-value">{formatPercent(roiPercent)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Annualized ROI</span>
          <span className="metric-value">
            {formatPercent(annualizedROI * 100)}
          </span>
        </div>
        {monthlyRentIncrease > 0 && (
          <>
            <div className="metric-card">
              <span className="metric-label">Monthly Rent Increase</span>
              <span className="metric-value">
                {formatCurrency(monthlyRentIncrease)}
              </span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Payback Period</span>
              <span className="metric-value">
                {paybackYears ? `${paybackYears.toFixed(1)} years` : "N/A"}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Valuation Method Info */}
      <div className="valuation-info">
        <h4>Valuation Method Used: {valuationMethods.used}</h4>
        <p>Appraisal method: {formatCurrency(valuationMethods.appraisal)}</p>
        <p>Income method: {formatCurrency(valuationMethods.income)}</p>
      </div>

      {/* Breakdown */}
      {breakdown && breakdown.length > 0 && (
        <div className="breakdown-section">
          <h3>Cost Breakdown</h3>
          {breakdown.map((item, index) => (
            <div key={index} className="breakdown-item">
              <span>{item.label || `Item ${index + 1}`}</span>
              <span>{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="charts-section">
        <ReturnOnRenovationCharts data={data} />
      </div>
    </div>
  );
}

export default RenovationROIResults;
