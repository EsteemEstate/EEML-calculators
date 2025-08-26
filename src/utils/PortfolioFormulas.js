// src/investment-calculators/Portfolio/PortfolioFormulas.js

/**
 * Portfolio Formulas & Calculations
 * -------------------------------
 * Includes:
 *  - Property-level metrics (equity, cashflow, cap rate, DSCR)
 *  - Portfolio-level aggregations (total value, total equity, NOI, IRR, cash-on-cash)
 *  - Risk sensitivity & projections
 */

import { IRR } from "financejs"; // optional, or implement your own IRR function

// ---------------------------
// PROPERTY-LEVEL CALCULATIONS
// ---------------------------

/**
 * Equity of a property at a given time
 * @param {object} property - property object
 * @returns {number} equity = currentValue - loanBalance
 */
export const equity = (property) => {
  const value = property.currentValue || property.purchasePrice || 0;
  const debt = property.loanBalance || property.loanAmount || 0;
  return value - debt;
};

/**
 * Net Cashflow of a property (annual)
 */
export const netCashflow = (property) => {
  const income = property.income || 0;
  const operatingExpenses = property.operatingExpenses || 0;
  const debtService = property.debtService || 0;

  return income - operatingExpenses - debtService;
};

/**
 * Cap rate
 */
export const capRate = (property) => {
  const noi = property.noi || 0;
  const value = property.currentValue || property.purchasePrice || 0;
  return value > 0 ? noi / value : 0;
};

/**
 * Debt Service Coverage Ratio (DSCR)
 */
export const dscr = (property) => {
  const noi = property.noi || 0;
  const debtService = property.debtService || 0;
  return debtService > 0 ? noi / debtService : 0;
};

/**
 * Break-even rent (monthly)
 */
export const breakEvenRent = (property) => {
  const annualExpenses =
    (property.operatingExpenses || 0) + (property.debtService || 0);
  const vacancyFactor = 1 - (property.vacancyRate || 0) / 100;
  return vacancyFactor > 0 ? annualExpenses / 12 / vacancyFactor : 0;
};

// ---------------------------
// PORTFOLIO-LEVEL AGGREGATIONS
// ---------------------------

/**
 * Total portfolio value
 */
export const totalPortfolioValue = (properties) =>
  properties.reduce((sum, p) => sum + (p.currentValue || 0), 0);

/**
 * Total portfolio equity
 */
export const totalEquity = (properties) =>
  properties.reduce((sum, p) => sum + equity(p), 0);

/**
 * Total portfolio NOI
 */
export const portfolioNOI = (properties) =>
  properties.reduce((sum, p) => sum + (p.noi || 0), 0);

/**
 * Total net cashflow
 */
export const totalCashflow = (properties) =>
  properties.reduce((sum, p) => sum + netCashflow(p), 0);

/**
 * Portfolio average cap rate
 */
export const portfolioCapRate = (properties) => {
  const totalValue = totalPortfolioValue(properties);
  return totalValue > 0
    ? properties.reduce(
        (sum, p) => sum + capRate(p) * (p.currentValue || 0),
        0
      ) / totalValue
    : 0;
};

/**
 * Portfolio Cash-on-Cash Return
 */
export const cashOnCashReturn = (properties) => {
  const totalCashFlow = totalCashflow(properties);
  const totalEquityInvested = properties.reduce(
    (sum, p) => sum + (p.downPayment || 0) + (p.closingCosts || 0),
    0
  );
  return totalEquityInvested > 0 ? totalCashFlow / totalEquityInvested : 0;
};

/**
 * Portfolio IRR (annualized)
 * Uses simple IRR library or custom implementation
 */
export const portfolioIRR = (properties) => {
  const cashFlows = properties.map((p) => [
    -(p.downPayment || 0) - (p.closingCosts || 0),
    ...Array(p.horizonYears || 10).fill(netCashflow(p)),
    equity(p), // exit
  ]);

  // Sum per year across properties
  const summedCashflows = [];
  for (let i = 0; i < Math.max(...cashFlows.map((cf) => cf.length)); i++) {
    summedCashflows.push(cashFlows.reduce((sum, cf) => sum + (cf[i] || 0), 0));
  }

  return IRR(summedCashflows) || 0;
};

/**
 * Portfolio LTV trajectory per year
 */
export const portfolioLTVTrajectory = (properties) => {
  const horizonYears = Math.max(...properties.map((p) => p.horizonYears || 0));
  const trajectory = Array(horizonYears)
    .fill(null)
    .map((_, year) => {
      const totalValue = properties.reduce(
        (sum, p) =>
          sum +
          (p.currentValue || p.purchasePrice) *
            Math.pow(1 + (p.appreciation || 0) / 100, year),
        0
      );
      const totalDebt = properties.reduce(
        (sum, p) => sum + (p.loanBalance || p.loanAmount || 0),
        0
      );
      return totalDebt / totalValue;
    });
  return trajectory;
};

// ---------------------------
// RISK & SENSITIVITY
// ---------------------------

/**
 * Sensitivity: returns array of {label, impact} for tornado chart
 */
export const portfolioRiskSensitivity = (properties, shocks = {}) => {
  // shocks: { rentDropPercent, occupancyDropPercent, interestRateRisePercent, valueDropPercent }
  return [
    {
      label: "Rent −10%",
      impact: totalEquity(
        properties.map((p) => ({ ...p, income: (p.income || 0) * 0.9 }))
      ),
    },
    {
      label: "Occupancy −15%",
      impact: totalEquity(
        properties.map((p) => ({ ...p, income: (p.income || 0) * 0.85 }))
      ),
    },
    {
      label: "Interest Rate +2%",
      impact: totalEquity(
        properties.map((p) => ({
          ...p,
          debtService: (p.debtService || 0) * 1.02,
        }))
      ),
    },
    {
      label: "Property Value −20%",
      impact: totalEquity(
        properties.map((p) => ({
          ...p,
          currentValue: (p.currentValue || p.purchasePrice) * 0.8,
        }))
      ),
    },
  ];
};
