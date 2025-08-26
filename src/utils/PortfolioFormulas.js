// src/investment-calculators/Portfolio/PortfolioFormulas.js

// ---------------------------
// SIMPLE IRR IMPLEMENTATION
// ---------------------------
/**
 * Simple IRR approximation using Newton-Raphson
 * @param {number[]} cashflows - array of cash flows, negative for outflows, positive for inflows
 * @param {number} guess - initial guess (default 0.1)
 * @returns {number} IRR as a decimal (e.g., 0.12 = 12%)
 */
export const IRR = (cashflows, guess = 0.1) => {
  const tol = 1e-6;
  const maxIter = 1000;
  let rate = guess;

  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dNPV = 0;
    cashflows.forEach((cf, t) => {
      npv += cf / Math.pow(1 + rate, t);
      dNPV -= (t * cf) / Math.pow(1 + rate, t + 1);
    });
    const newRate = rate - npv / dNPV;
    if (Math.abs(newRate - rate) < tol) return rate;
    rate = newRate;
  }

  return rate;
};

// ---------------------------
// PROPERTY-LEVEL CALCULATIONS
// ---------------------------

export const propertyIncome = (property) => {
  switch (property.type) {
    case "residential":
      const annualRent =
        (property.rent || 0) * 12 * (1 - (property.vacancyRate || 0) / 100);
      return annualRent * (1 + (property.rentGrowth || 0) / 100);
    case "airbnb":
      return (
        (property.nightlyRate || 0) *
        365 *
        ((property.occupancyRate || 0) / 100) *
        (1 + (property.seasonalVariation || 0) / 100)
      );
    case "commercial":
      return (
        (property.annualLeaseAmount || 0) *
        (1 + (property.escalationClause || 0) / 100)
      );
    case "land":
      return (property.rent || 0) * (1 + (property.rentGrowth || 0) / 100);
    default:
      return 0;
  }
};

export const totalOperatingExpenses = (property) => {
  const oe = property.operatingExpenses || {};
  const value = property.currentValue || property.purchasePrice || 0;
  const income = propertyIncome(property);

  return (
    ((oe.propertyTax || 0) * value) / 100 +
    ((oe.maintenance || 0) * value) / 100 +
    ((oe.managementFeesPercent || 0) * income) / 100 +
    (oe.insurance || 0) +
    (oe.hoa || 0) +
    (oe.utilities || 0) +
    (oe.other || 0)
  );
};

export const noi = (property) =>
  propertyIncome(property) - totalOperatingExpenses(property);
export const debtService = (property) =>
  property.monthlyPI ? property.monthlyPI * 12 : 0;
export const equity = (property) =>
  (property.currentValue || property.purchasePrice || 0) -
  (property.loanBalance || property.loanAmount || 0);
export const netCashflow = (property) => noi(property) - debtService(property);
export const capRate = (property) => {
  const v = property.currentValue || property.purchasePrice || 0;
  return v > 0 ? noi(property) / v : 0;
};
export const dscr = (property) => {
  const debt = debtService(property);
  return debt > 0 ? noi(property) / debt : 0;
};
export const breakEvenRent = (property) => {
  const expenses = totalOperatingExpenses(property) + debtService(property);
  const vacancyFactor = 1 - (property.vacancyRate || 0) / 100;
  return vacancyFactor > 0 ? expenses / 12 / vacancyFactor : 0;
};

// ---------------------------
// PORTFOLIO-LEVEL CALCULATIONS
// ---------------------------

export const totalPortfolioValue = (properties) =>
  properties.reduce(
    (sum, p) => sum + (p.currentValue || p.purchasePrice || 0),
    0
  );
export const totalEquity = (properties) =>
  properties.reduce((sum, p) => sum + equity(p), 0);
export const portfolioNOI = (properties) =>
  properties.reduce((sum, p) => sum + noi(p), 0);
export const totalCashflow = (properties) =>
  properties.reduce((sum, p) => sum + netCashflow(p), 0);
export const portfolioCapRate = (properties) => {
  const totalValue = totalPortfolioValue(properties);
  return totalValue > 0
    ? properties.reduce(
        (sum, p) => sum + capRate(p) * (p.currentValue || p.purchasePrice || 0),
        0
      ) / totalValue
    : 0;
};
export const cashOnCashReturn = (properties) => {
  const totalCF = totalCashflow(properties);
  const totalInvested = properties.reduce(
    (sum, p) => sum + (p.downPayment || 0) + (p.closingCosts || 0),
    0
  );
  return totalInvested > 0 ? totalCF / totalInvested : 0;
};
export const portfolioIRR = (properties) => {
  const cashFlows = properties.map((p) => [
    -(p.downPayment || 0) - (p.closingCosts || 0),
    ...Array(p.horizonYears || 10).fill(netCashflow(p)),
    equity(p),
  ]);

  const summedCF = [];
  for (let i = 0; i < Math.max(...cashFlows.map((cf) => cf.length)); i++) {
    summedCF.push(cashFlows.reduce((sum, cf) => sum + (cf[i] || 0), 0));
  }

  return IRR(summedCF) || 0;
};
export const portfolioLTVTrajectory = (properties) => {
  const horizonYears = Math.max(...properties.map((p) => p.horizonYears || 0));
  return Array(horizonYears)
    .fill(null)
    .map((_, year) => {
      const totalValue = properties.reduce(
        (sum, p) =>
          sum +
          (p.currentValue || p.purchasePrice || 0) *
            Math.pow(1 + (p.appreciation || 0) / 100, year),
        0
      );
      const totalDebt = properties.reduce(
        (sum, p) => sum + (p.loanBalance || p.loanAmount || 0),
        0
      );
      return totalDebt / totalValue;
    });
};

// ---------------------------
// RISK & SENSITIVITY
// ---------------------------

export const portfolioRiskSensitivity = (properties, shocks = {}) => {
  return [
    {
      label: "Rent −10%",
      impact: totalEquity(
        properties.map((p) => ({ ...p, income: propertyIncome(p) * 0.9 }))
      ),
    },
    {
      label: "Occupancy −15%",
      impact: totalEquity(
        properties.map((p) => ({ ...p, income: propertyIncome(p) * 0.85 }))
      ),
    },
    {
      label: "Interest Rate +2%",
      impact: totalEquity(
        properties.map((p) => ({ ...p, debtService: debtService(p) * 1.02 }))
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
