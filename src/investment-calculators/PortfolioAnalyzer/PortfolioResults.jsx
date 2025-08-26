// PortfolioResults.jsx
import React from "react";
import PortfolioCharts from "./PortfolioCharts";

function PortfolioResults({ data }) {
  if (!data || !data.properties || data.properties.length === 0) {
    return (
      <div className="empty-state">
        No data to display. Please submit the form.
      </div>
    );
  }

  const {
    properties,
    totalPortfolioValue,
    totalEquity,
    totalNOI,
    cashOnCashReturn,
    avgCapRate,
    irr,
    dscr,
    riskConcentration,
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

  return (
    <div className="results-container">
      <h2 className="results-header">Portfolio Analysis</h2>

      {/* Portfolio-Level Metrics */}
      <div className="metrics-cards">
        <div className="metric-card">
          <span className="metric-label">Total Portfolio Value</span>
          <span className="metric-value">
            {formatCurrency(totalPortfolioValue)}
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Equity</span>
          <span className="metric-value">{formatCurrency(totalEquity)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total NOI</span>
          <span className="metric-value">{formatCurrency(totalNOI)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Cash-on-Cash Return</span>
          <span className="metric-value">
            {(cashOnCashReturn * 100).toFixed(2)}%
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Average Cap Rate</span>
          <span className="metric-value">{(avgCapRate * 100).toFixed(2)}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Portfolio IRR</span>
          <span className="metric-value">{(irr * 100).toFixed(2)}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">DSCR</span>
          <span className="metric-value">{dscr?.toFixed(2) || "N/A"}</span>
        </div>
      </div>

      {/* Property-Level Metrics */}
      <div className="detailed-results">
        <h3>Property-Level Metrics</h3>
        {properties.map((prop, idx) => (
          <div className="property-metrics" key={idx}>
            <h4>{prop.name}</h4>
            <div className="result-row">
              <span className="result-label">Equity:</span>
              <span className="result-value">
                {formatCurrency(prop.equity)}
              </span>
            </div>
            <div className="result-row">
              <span className="result-label">Net Cashflow:</span>
              <span className="result-value">
                {formatCurrency(prop.netCashflow)}
              </span>
            </div>
            <div className="result-row">
              <span className="result-label">Cap Rate:</span>
              <span className="result-value">
                {(prop.capRate * 100).toFixed(2)}%
              </span>
            </div>
            <div className="result-row">
              <span className="result-label">DSCR:</span>
              <span className="result-value">
                {prop.dscr?.toFixed(2) || "N/A"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="portfolio-charts-section">
        <div className="chart-container">
          <h3>Portfolio Value & Equity Growth</h3>
          <PortfolioCharts type="portfolioValueEquity" data={data} />
        </div>

        <div className="chart-container">
          <h3>Property Type Allocation</h3>
          <PortfolioCharts type="propertyTypeAllocation" data={data} />
        </div>

        <div className="chart-container">
          <h3>Cashflow & NOI Trend</h3>
          <PortfolioCharts type="cashflowTrend" data={data} />
        </div>

        <div className="chart-container">
          <h3>Risk Sensitivity Tornado</h3>
          <PortfolioCharts type="riskTornado" data={data} />
        </div>

        <div className="chart-container">
          <h3>Property Contribution to Equity</h3>
          <PortfolioCharts type="equityContribution" data={data} />
        </div>
      </div>
    </div>
  );
}

export default PortfolioResults;
