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
 * Calculate Total Annual Income
 * @param {number} monthlyRent - Monthly rent
 * @param {number} otherIncome - Other annual income
 * @param {number} vacancyRate - Vacancy rate percentage
 * @returns {number} Total annual income (rounded to 2 decimals)
 */
export function calculateTotalAnnualIncome(
  monthlyRent,
  otherIncome,
  vacancyRate
) {
  const annualRent = calculateAnnualRent(monthlyRent, vacancyRate);
  return parseFloat((annualRent + (otherIncome || 0)).toFixed(2));
}

/**
 * Calculate Total Annual Expenses
 * @param {Object} expenses - Object containing various expense fields
 * @returns {number} Total annual expenses (rounded to 2 decimals)
 */
export function calculateTotalAnnualExpenses(expenses) {
  const {
    managementFees,
    maintenance,
    propertyTaxes,
    insurance,
    utilities,
    hoaFees,
    security,
    cleaning,
    marketing,
    legalAccounting,
    vacancyAllowance,
    badDebtAllowance,
    licensingFees,
    camRecoveries,
    turnoverRentClauses,
  } = expenses;

  return sumValues([
    managementFees,
    maintenance,
    propertyTaxes,
    insurance,
    utilities,
    hoaFees,
    security,
    cleaning,
    marketing,
    legalAccounting,
    vacancyAllowance,
    badDebtAllowance,
    licensingFees,
    camRecoveries,
    turnoverRentClauses,
  ]);
}

/**
 * Calculate Annual Cash Flow with New Inputs
 * @param {number} monthlyRent - Monthly rent
 * @param {number} otherIncome - Other annual income
 * @param {Object} expenses - Object containing various expense fields
 * @param {number} debtService - Annual mortgage payments
 * @param {number} vacancyRate - Vacancy rate percentage
 * @returns {number} Annual cash flow (rounded to 2 decimals)
 */
export function calculateAnnualCashFlowWithNewInputs(
  monthlyRent,
  otherIncome,
  expenses,
  debtService,
  vacancyRate
) {
  const totalIncome = calculateTotalAnnualIncome(
    monthlyRent,
    otherIncome,
    vacancyRate
  );
  const totalExpenses = calculateTotalAnnualExpenses(expenses);
  return calculateCashFlow(totalIncome, totalExpenses, debtService);
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
