// src/investment-calculators/Mortgage/MortgageResults.jsx
import React from "react";
import MortgageCharts from "./MortgageCharts";

function MortgageResults({ data }) {
  if (!data) {
    return (
      <div className="results-empty">
        No data to display. Please submit the form.
      </div>
    );
  }

  const {
    loanAmount,
    monthlyPrincipalAndInterest,
    monthlyTaxes = 0,
    monthlyInsurance = 0,
    monthlyHOA = 0,
    monthlyPMI = 0,
    totalMonthlyPayment,
    totalInterestPaid,
    totalPrincipalPaid,
    totalTaxes,
    totalInsurance,
    totalHOA,
    totalPMI,
    totalCostOfLoan,
    payoffYears,
    payoffMonths,
    amortizationSchedule,
    savingsFromExtraPayments = 0,
    breakdown = [],
  } = data;

  // Normalize breakdown to ensure all labels/amounts exist
  const normalizedData = {
    ...data,
    breakdown: breakdown.map((item, index) => ({
      label: item.label || item.name || `Item ${index + 1}`,
      amount: item.amount ?? 0,
    })),
  };

  // Format helpers
  const formatCurrency = (value) =>
    typeof value === "number"
      ? value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        })
      : "N/A";

  return (
    <div className="results-container">
      <h2 className="results-header">Mortgage Analysis</h2>

      {/* Key Metrics */}
      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Loan Amount</span>
            <span className="metric-value">{formatCurrency(loanAmount)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Monthly P&I</span>
            <span className="metric-value">
              {formatCurrency(monthlyPrincipalAndInterest)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Total Monthly Payment</span>
            <span className="metric-value">
              {formatCurrency(totalMonthlyPayment)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Total Interest Paid</span>
            <span className="metric-value">
              {formatCurrency(totalInterestPaid)}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">Total Cost of Loan</span>
            <span className="metric-value">
              {formatCurrency(totalCostOfLoan)}
            </span>
          </div>
        </div>

        {savingsFromExtraPayments > 0 && (
          <div className="metric-card positive-value">
            <div className="metric-content">
              <span className="metric-label">Savings from Extra Payments</span>
              <span className="metric-value">
                {formatCurrency(savingsFromExtraPayments)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Loan Details */}
      <div className="detailed-results">
        <div className="result-row">
          <span className="result-label">Payoff Time:</span>
          <span className="result-value">
            {payoffYears} years {payoffMonths} months
          </span>
        </div>
        <div className="result-row">
          <span className="result-label">Principal Paid:</span>
          <span className="result-value">
            {formatCurrency(totalPrincipalPaid)}
          </span>
        </div>
        <div className="result-row">
          <span className="result-label">Taxes Paid:</span>
          <span className="result-value">{formatCurrency(totalTaxes)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Insurance Paid:</span>
          <span className="result-value">{formatCurrency(totalInsurance)}</span>
        </div>
        {totalHOA > 0 && (
          <div className="result-row">
            <span className="result-label">HOA Fees Paid:</span>
            <span className="result-value">{formatCurrency(totalHOA)}</span>
          </div>
        )}
        {totalPMI > 0 && (
          <div className="result-row">
            <span className="result-label">PMI Paid:</span>
            <span className="result-value">{formatCurrency(totalPMI)}</span>
          </div>
        )}
      </div>

      {/* Payment Breakdown */}
      {normalizedData.breakdown.length > 0 && (
        <div className="detailed-results">
          <h3>Payment Breakdown</h3>
          {normalizedData.breakdown.map((item, index) => (
            <div key={index} className="result-row">
              <span className="result-label">{item.label}</span>
              <span className="result-value">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="charts">
        <MortgageCharts
          data={{
            amortizationSchedule,
            breakdown: normalizedData.breakdown,
          }}
        />
      </div>
    </div>
  );
}

export default MortgageResults;
