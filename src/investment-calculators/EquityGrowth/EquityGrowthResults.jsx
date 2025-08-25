// src/investment-calculators/EquityGrowth/EquityGrowthResults.jsx
import React from "react";
import EquityGrowthCharts from "./EquityGrowthCharts";

function EquityGrowthResults({ data }) {
  if (!data || !data.equityValues) {
    return (
      <div className="empty-state">
        No data to display. Please submit the form.
      </div>
    );
  }

  const {
    equityToday,
    equityAtHorizon,
    netAfterSale,
    equityCAGR,
    propertyValues,
    loanBalances,
    equityValues,
    mcPercentiles,
    equitySources,
    costBreakdown,
    currency,
  } = data;

  const formatCurrency = (value) =>
    typeof value === "number"
      ? value.toLocaleString("en-US", {
          style: "currency",
          currency: currency || "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "N/A";

  // ---------------------------
  // Investment Health Section
  // ---------------------------
  const isHealthy = equityCAGR >= 0.05 && netAfterSale > equityToday; // example criteria
  const healthColor = isHealthy ? "positive-value" : "negative-value";
  const healthVerdict = isHealthy
    ? "Your investment is on a healthy growth trajectory."
    : "Caution: Growth is slow or negative; consider reviewing strategy.";

  return (
    <div className="results-container">
      <h2 className="results-header">Equity Growth Analysis</h2>

      {/* Key Metrics Cards */}
      <div className="metrics-cards">
        <div className="metric-card">
          <span className="metric-label">Current Equity</span>
          <span className="metric-value">{formatCurrency(equityToday)}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Equity at Horizon</span>
          <span className="metric-value">
            {formatCurrency(equityAtHorizon)}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Net After Sale</span>
          <span className="metric-value">{formatCurrency(netAfterSale)}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Equity CAGR</span>
          <span className="metric-value">{(equityCAGR * 100).toFixed(2)}%</span>
        </div>
      </div>

      {/* Equity Sources Breakdown */}
      {equitySources?.length > 0 && (
        <div className="detailed-results">
          <h3>Equity Sources Breakdown</h3>
          {equitySources.map((source, idx) => (
            <div className="result-row" key={idx}>
              <span className="result-label">{source.label}:</span>
              <span className="result-value">
                {formatCurrency(source.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Investment Health */}
      <div className={`investment-health ${healthColor}`}>
        <h3>Investment Health</h3>
        <p>{healthVerdict}</p>
      </div>

      {/* Charts Section */}
      <div className="equity-charts-section">
        <div className="equity-chart-container">
          <h3>Equity vs Time</h3>
          <EquityGrowthCharts type="equityTimeline" data={data} />
        </div>

        <div className="equity-chart-container">
          <h3>Property Value & Loan Balance</h3>
          <EquityGrowthCharts type="propertyLoan" data={data} />
        </div>

        <div className="equity-chart-container">
          <h3>Equity Sources Waterfall</h3>
          <EquityGrowthCharts type="waterfall" data={data} />
        </div>
      </div>
    </div>
  );
}

export default EquityGrowthResults;
