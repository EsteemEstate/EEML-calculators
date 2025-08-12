// ROICALCULATOR

export function calculateROI({
  price,
  rent,
  otherIncome = 0,
  taxes,
  insurance,
  maintenance,
  propertyManagement,
  utilities,
  hoaFees = 0,
  vacancyRate,
  appreciationRate,
  rentIncreaseRate = 0,
  holdingPeriod,
  downPayment = 0,
  closingCosts = 0,
  loanAmount,
  interestRate,
  loanTerm,
}) {
  // Convert percentages to decimals
  const appreciationDecimal = appreciationRate / 100;
  const rentIncreaseDecimal = rentIncreaseRate / 100;
  const vacancyDecimal = vacancyRate / 100;

  // 1. Calculate Monthly Mortgage Payment (P&I)
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyMortgagePayment =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  // 2. Calculate Gross Potential Income (GPI)
  const grossPotentialIncome = rent + otherIncome;

  // 3. Calculate Vacancy Loss
  const vacancyLoss = grossPotentialIncome * vacancyDecimal;

  // 4. Calculate Effective Gross Income (EGI)
  const effectiveGrossIncome = grossPotentialIncome - vacancyLoss;

  // 5. Calculate Operating Expenses (monthly)
  const monthlyOperatingExpenses =
    (taxes +
      insurance +
      maintenance +
      propertyManagement +
      utilities +
      hoaFees) /
    12;

  // 6. Calculate Net Operating Income (NOI)
  const monthlyNOI = effectiveGrossIncome - monthlyOperatingExpenses;
  const annualNOI = monthlyNOI * 12;

  // 7. Calculate Cash Flow (after debt service)
  const monthlyCashFlow = monthlyNOI - monthlyMortgagePayment;
  const annualCashFlow = monthlyCashFlow * 12;

  // 8. Calculate Future Property Value
  const futurePropertyValue =
    price * Math.pow(1 + appreciationDecimal, holdingPeriod);
  const capitalGain = futurePropertyValue - price;

  // 9. Calculate Total Cash Invested
  const totalCashInvested = downPayment + closingCosts;

  // 10. Calculate Total Gain (appreciation + cumulative cash flow)
  const totalGain = capitalGain + annualCashFlow * holdingPeriod;

  // 11. Calculate ROI Metrics
  const totalROI = (totalGain / totalCashInvested) * 100;
  const capRate = (annualNOI / price) * 100; // Cap rate uses NOI, not cash flow
  const cashOnCash = (annualCashFlow / totalCashInvested) * 100;

  return {
    roi: {
      totalROI: parseFloat(totalROI.toFixed(2)),
      capRate: parseFloat(capRate.toFixed(2)),
      cashOnCash: parseFloat(cashOnCash.toFixed(2)),
      annualCashFlow: parseFloat(annualCashFlow.toFixed(2)),
      appreciation: parseFloat(capitalGain.toFixed(2)),
      futureValue: parseFloat(futurePropertyValue.toFixed(2)),
      monthlyCashFlow: parseFloat(monthlyCashFlow.toFixed(2)),
    },
  };
}

// src/formulas.js

/**
 * Calculate Gross Rental Yield
 * @param {number} annualRent - Annual rental income
 * @param {number} propertyPrice - Purchase price or current market value
 * @returns {number} Gross yield percentage
 */
export function calculateGrossYield(annualRent, propertyPrice) {
  if (!propertyPrice) return 0;
  return (annualRent / propertyPrice) * 100;
}

/**
 * Calculate Net Rental Yield
 * @param {number} annualRent - Annual rental income
 * @param {number} expenses - Total annual expenses
 * @param {number} propertyPrice - Purchase price or current market value
 * @returns {number} Net yield percentage
 */
export function calculateNetYield(annualRent, expenses, propertyPrice) {
  if (!propertyPrice) return 0;
  return ((annualRent - expenses) / propertyPrice) * 100;
}

/**
 * Calculate Cap Rate
 * @param {number} totalIncome - Annual total income (rent + other)
 * @param {number} expenses - Annual expenses
 * @param {number} propertyPrice - Purchase price or market value
 * @returns {number} Cap rate percentage
 */
export function calculateCapRate(totalIncome, expenses, propertyPrice) {
  if (!propertyPrice) return 0;
  return ((totalIncome - expenses) / propertyPrice) * 100;
}

/**
 * Calculate Cash-on-Cash Return
 * @param {number} cashFlow - Annual net cash flow (after expenses & financing)
 * @param {number} totalCashInvested - Equity + acquisition costs
 * @returns {number} Cash-on-Cash return percentage
 */
export function calculateCashOnCash(cashFlow, totalCashInvested) {
  if (!totalCashInvested) return 0;
  return (cashFlow / totalCashInvested) * 100;
}

/**
 * Calculate Annual Cash Flow
 * @param {number} totalIncome - Annual income
 * @param {number} expenses - Annual expenses
 * @param {number} annualDebtService - Annual mortgage payments
 * @returns {number} Annual cash flow
 */
export function calculateCashFlow(totalIncome, expenses, annualDebtService) {
  return totalIncome - expenses - annualDebtService;
}

/**
 * Calculate Annual Debt Service (Interest-Only)
 * @param {number} mortgageAmount - Loan principal
 * @param {number} interestRate - Annual interest rate (%)
 * @returns {number} Annual interest payment
 */
export function calculateAnnualInterestOnly(mortgageAmount, interestRate) {
  return mortgageAmount * (interestRate / 100);
}

/**
 * Calculate Annual Debt Service (Principal + Interest)
 * @param {number} mortgageAmount - Loan principal
 * @param {number} interestRate - Annual interest rate (%)
 * @param {number} loanTermYears - Term in years
 * @returns {number} Annual payment
 */
export function calculateAnnualPI(mortgageAmount, interestRate, loanTermYears) {
  if (!mortgageAmount || !interestRate || !loanTermYears) return 0;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;
  const monthlyPayment =
    (mortgageAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numPayments));
  return monthlyPayment * 12;
}

/**
 * Calculate Payback Period
 * @param {number} totalCashInvested - Equity + acquisition costs
 * @param {number} annualCashFlow - Net annual cash flow
 * @returns {number|null} Payback period in years or null if cash flow <= 0
 */
export function calculatePaybackPeriod(totalCashInvested, annualCashFlow) {
  if (annualCashFlow <= 0) return null;
  return totalCashInvested / annualCashFlow;
}

/**
 * Calculate Annual Rent Adjusted for Vacancy
 * @param {number} monthlyRent - Monthly rental amount
 * @param {number} vacancyRate - % vacancy (0-100)
 * @returns {number} Annual rental income after vacancy
 */
export function calculateAnnualRent(monthlyRent, vacancyRate) {
  const vacancyFraction = vacancyRate / 100;
  return monthlyRent * 12 * (1 - vacancyFraction);
}

/**
 * Sum array of values (string or number)
 * @param {Array} arr - Array of numbers or numeric strings
 * @returns {number} Sum of all parsed values
 */
export function sumValues(arr) {
  return arr.map((v) => parseFloat(v) || 0).reduce((a, b) => a + b, 0);
}
