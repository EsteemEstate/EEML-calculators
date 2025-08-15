// BEFormulas.js – Break-Even Calculator Logic

export function calculateBreakEven(inputs) {
  // --- 1. Acquisition & Financing ---
  const purchasePrice = parseFloat(inputs.purchasePrice) || 0;
  const downPayment = parseFloat(inputs.downPayment) || 0;
  const closingCosts = parseFloat(inputs.closingCosts) || 0;
  const rehabCost = parseFloat(inputs.rehabCost) || 0;
  const furnishingsCost = parseFloat(inputs.furnishingsCost) || 0; // STR only
  const lenderPointsFee =
    ((parseFloat(inputs.lenderPoints) || 0) / 100) *
    (purchasePrice - downPayment);

  const loanAmount = inputs.loanAmount
    ? parseFloat(inputs.loanAmount)
    : purchasePrice - downPayment;

  const totalAcquisitionCost =
    purchasePrice +
    closingCosts +
    rehabCost +
    furnishingsCost +
    lenderPointsFee;

  // --- 2. Fixed Monthly Expenses ---
  const monthlyPropertyTax = parseFloat(inputs.propertyTax) || 0;
  const monthlyInsurance = parseFloat(inputs.insurance) || 0;
  const hoaFee = parseFloat(inputs.hoaFee) || 0;
  const utilitiesWater = parseFloat(inputs.utilitiesWater) || 0;
  const utilitiesElectric = parseFloat(inputs.utilitiesElectric) || 0;
  const utilitiesInternet = parseFloat(inputs.utilitiesInternet) || 0;
  const utilitiesGas = parseFloat(inputs.utilitiesGas) || 0;
  const adminCosts = parseFloat(inputs.adminCosts) || 0;

  const totalFixedExpenses =
    monthlyPropertyTax +
    monthlyInsurance +
    hoaFee +
    utilitiesWater +
    utilitiesElectric +
    utilitiesInternet +
    utilitiesGas +
    adminCosts;

  // --- 3. Variable Expenses ---
  const scheduledRent = parseFloat(inputs.monthlyRent) || 0;
  const collectedRent = scheduledRent; // placeholder, could adjust for vacancy

  const managementFee =
    ((parseFloat(inputs.managementFeePercent) || 0) / 100) * collectedRent;
  const maintenanceReserve =
    ((parseFloat(inputs.maintenanceReservePercent) || 0) / 100) * scheduledRent;
  const capexReserve =
    (((parseFloat(inputs.capexReservePercent) || 0) / 100) * purchasePrice) /
    12;
  const leasingFee =
    ((parseFloat(inputs.leasingFeePercent) || 0) / 100) * scheduledRent;
  const vacancyAllowance =
    ((parseFloat(inputs.vacancyPercent) || 0) / 100) * scheduledRent;
  const badDebtAllowance =
    ((parseFloat(inputs.badDebtPercent) || 0) / 100) * collectedRent;

  const totalVariableExpenses =
    managementFee +
    maintenanceReserve +
    capexReserve +
    leasingFee +
    vacancyAllowance +
    badDebtAllowance;

  // --- 4. Revenue ---
  // LTR
  const grossScheduledIncomeLTR =
    scheduledRent * 12 + (parseFloat(inputs.otherIncome) || 0);
  const effectiveGrossIncomeLTR =
    grossScheduledIncomeLTR - vacancyAllowance * 12 - badDebtAllowance * 12;

  // STR
  const nightlyRate = parseFloat(inputs.nightlyRate) || 0;
  const occupiedNightsPerMonth = parseFloat(inputs.occupancyRate) || 0;
  const upsells = parseFloat(inputs.upsells) || 0;
  const turnoverCost = parseFloat(inputs.turnoverCost) || 0;
  const channelFeePercent = parseFloat(inputs.channelFeePercent) || 0;

  const monthlyGrossBookingRevenue =
    nightlyRate * occupiedNightsPerMonth + upsells;
  const channelFee = (channelFeePercent / 100) * monthlyGrossBookingRevenue;
  const totalCleaningTurnover = turnoverCost; // per month approximation

  const netRevenueSTR =
    monthlyGrossBookingRevenue -
    channelFee -
    totalCleaningTurnover -
    capexReserve -
    maintenanceReserve -
    managementFee;

  // --- 5. NOI / Cash Flow / DSCR ---
  const NOI_LTR =
    effectiveGrossIncomeLTR - (totalFixedExpenses + totalVariableExpenses);
  const monthlyDebtService = calculateMortgagePayment(
    loanAmount,
    parseFloat(inputs.interestRate) || 0,
    parseFloat(inputs.loanTerm) || 1,
    inputs.paymentFrequency || "Monthly"
  );
  const cashFlow_LTR = NOI_LTR / 12 - monthlyDebtService;
  const DSCR = monthlyDebtService ? NOI_LTR / (monthlyDebtService * 12) : 0;

  // --- 6. Break-Even ---
  const breakEvenRent =
    (totalFixedExpenses + totalVariableExpenses) /
    (1 -
      ((parseFloat(inputs.vacancyPercent) || 0) / 100 +
        (parseFloat(inputs.managementFeePercent) || 0) / 100));

  const breakEvenOccupancyLTR = scheduledRent
    ? (totalFixedExpenses + totalVariableExpenses) / scheduledRent
    : 0;

  const breakEvenNightlyRateSTR = occupiedNightsPerMonth
    ? (totalFixedExpenses + totalVariableExpenses) / occupiedNightsPerMonth
    : 0;

  // --- 7. Operating Expense Ratio ---
  const operatingExpenseRatio = effectiveGrossIncomeLTR
    ? (totalFixedExpenses + totalVariableExpenses) / effectiveGrossIncomeLTR
    : 0;

  // --- 8. Payback Period ---
  const paybackPeriodMonths =
    cashFlow_LTR > 0 ? totalAcquisitionCost / cashFlow_LTR : Infinity;

  // --- 9. Cost Stack ---
  const costStack = {
    fixed: totalFixedExpenses,
    variable: totalVariableExpenses,
    debt: monthlyDebtService * 12,
  };

  // --- 10. Sensitivity Analysis (placeholders) ---
  const sensitivity = {
    rentMinus10: cashFlow_LTR * 0.9,
    rentPlus10: cashFlow_LTR * 1.1,
    occupancyMinus5: cashFlow_LTR * 0.95,
    occupancyPlus5: cashFlow_LTR * 1.05,
  };

  return {
    // Acquisition / Loan
    totalAcquisitionCost,
    loanAmount,
    monthlyDebtService,

    // Revenue / NOI / Cash Flow
    grossScheduledIncomeLTR,
    effectiveGrossIncomeLTR,
    NOI_LTR,
    cashFlow_LTR,
    netRevenueSTR,
    DSCR,

    // Break-Even
    breakEvenRent,
    breakEvenOccupancyLTR,
    breakEvenNightlyRateSTR,

    // Ratios
    operatingExpenseRatio,
    paybackPeriodMonths,
    costStack,
    sensitivity,
  };
}

// --- Helper: Mortgage Payment Calculator ---
function calculateMortgagePayment(
  principal,
  annualRate,
  years,
  frequency = "Monthly"
) {
  const n = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}
