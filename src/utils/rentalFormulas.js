// src/formulas.js

/**
 * Calculate Gross Rental Yield
 * @param {number} annualRent - Annual rental income
 * @param {number} propertyPrice - Purchase price
 * @returns {number} Gross yield percentage (1 decimal place)
 */
export function calculateGrossYield(annualRent, propertyPrice) {
  if (!propertyPrice || propertyPrice <= 0) return 0;
  return parseFloat(((annualRent / propertyPrice) * 100).toFixed(1));
}

/**
 * Calculate Net Rental Yield
 * @param {number} annualRent - Annual rental income
 * @param {number} expenses - Total annual expenses
 * @param {number} propertyPrice - Purchase price
 * @returns {number} Net yield percentage (1 decimal place)
 */
export function calculateNetYield(annualRent, expenses, propertyPrice) {
  if (!propertyPrice || propertyPrice <= 0) return 0;
  return parseFloat(
    (((annualRent - expenses) / propertyPrice) * 100).toFixed(1)
  );
}

/**
 * Calculate Capitalization Rate (Cap Rate)
 * @param {number} netOperatingIncome - Annual income minus expenses
 * @param {number} propertyPrice - Purchase price
 * @returns {number} Cap rate percentage (1 decimal place)
 */
export function calculateCapRate(netOperatingIncome, propertyPrice) {
  if (!propertyPrice || propertyPrice <= 0) return 0;
  return parseFloat(((netOperatingIncome / propertyPrice) * 100).toFixed(1));
}

/**
 * Calculate Cash-on-Cash Return
 * @param {number} annualCashFlow - After-tax cash flow
 * @param {number} totalCashInvested - Down payment + closing costs
 * @returns {number} CoC return percentage (1 decimal place)
 */
export function calculateCashOnCash(annualCashFlow, totalCashInvested) {
  if (!totalCashInvested || totalCashInvested <= 0) return 0;
  return parseFloat(((annualCashFlow / totalCashInvested) * 100).toFixed(1));
}

/**
 * Calculate Annual Cash Flow
 * @param {number} grossIncome - Total annual income
 * @param {number} operatingExpenses - Total annual expenses
 * @param {number} debtService - Annual mortgage payments
 * @returns {number} Annual cash flow (rounded to 2 decimals)
 */
export function calculateCashFlow(
  grossIncome,
  operatingExpenses,
  debtService = 0
) {
  return parseFloat(
    (
      (grossIncome || 0) -
      (operatingExpenses || 0) -
      (debtService || 0)
    ).toFixed(2)
  );
}

/**
 * Calculate Mortgage Payment (P+I)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (e.g., 4.5 for 4.5%)
 * @param {number} years - Loan term
 * @returns {number} Monthly payment (rounded to 2 decimals)
 */
export function calculateMortgagePayment(principal, annualRate, years) {
  if (!principal || !annualRate || !years || principal <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  // Handle interest-free loan
  if (monthlyRate === 0) return parseFloat((principal / months).toFixed(2));

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return parseFloat(payment.toFixed(2));
}

/**
 * Calculate Net Operating Income (NOI)
 * @param {number} grossIncome - Total annual income
 * @param {number} operatingExpenses - Total annual expenses
 * @returns {number} NOI (rounded to 2 decimals)
 */
export function calculateNOI(grossIncome, operatingExpenses) {
  return parseFloat(((grossIncome || 0) - (operatingExpenses || 0)).toFixed(2));
}

/**
 * Calculate Total Cash Invested
 * @param {number} propertyPrice
 * @param {number} loanAmount
 * @param {number} closingCosts
 * @returns {number} Total cash invested
 */
export function calculateTotalCashInvested(
  propertyPrice,
  loanAmount,
  closingCosts
) {
  return parseFloat(
    ((propertyPrice || 0) - (loanAmount || 0) + (closingCosts || 0)).toFixed(2)
  );
}

/**
 * Calculate Payback Period
 * @param {number} totalInvestment - Total cash invested
 * @param {number} annualCashFlow - Net annual cash flow
 * @returns {number|null} Years to recoup investment (1 decimal) or null if invalid
 */
export function calculatePaybackPeriod(totalInvestment, annualCashFlow) {
  if (annualCashFlow <= 0 || totalInvestment <= 0) return null;
  return parseFloat((totalInvestment / annualCashFlow).toFixed(1));
}

/**
 * Calculate Annual Rent with Vacancy
 * @param {number} monthlyRent
 * @param {number} vacancyRate - Percentage (0-100)
 * @returns {number} Annual rent (rounded to 2 decimals)
 */
export function calculateAnnualRent(monthlyRent, vacancyRate = 0) {
  const rent = parseFloat(monthlyRent) || 0;
  const vacancyFactor = 1 - (parseFloat(vacancyRate) / 100 || 0);
  return parseFloat((rent * 12 * vacancyFactor).toFixed(2));
}

/**
 * Sum values with type safety
 * @param {Array} values - Array of numbers/strings
 * @returns {number} Sum (rounded to 2 decimals)
 */
export function sumValues(values) {
  return parseFloat(
    values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)
  );
}
