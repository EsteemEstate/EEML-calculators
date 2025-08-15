// CR Formulas – Cap Rate Calculator Logic

export function calculateCapRate(data) {
  const {
    price,
    rent,
    vacancyRate,
    parkingIncome,
    storageIncome,
    laundryIncome,
    advertisingIncome,
    serviceFeesIncome,
    eventRentalsIncome,
    rentGrowthRate,
    taxes,
    insurance,
    maintenance,
    propertyManagement,
    utilities,
    hoaFees,
    otherExpenses,
    expenseGrowthRate,
    exitValue,
    exitCapRate,
    holdingPeriod,
  } = data;

  // --- Income Calculations ---
  const annualRent = (parseFloat(rent) || 0) * 12;
  const otherIncomeTotal =
    (parseFloat(parkingIncome) || 0) +
    (parseFloat(storageIncome) || 0) +
    (parseFloat(laundryIncome) || 0) +
    (parseFloat(advertisingIncome) || 0) +
    (parseFloat(serviceFeesIncome) || 0) +
    (parseFloat(eventRentalsIncome) || 0);

  const grossScheduledIncome = annualRent + otherIncomeTotal;
  const vacancyLoss =
    grossScheduledIncome * ((parseFloat(vacancyRate) || 0) / 100);
  const effectiveGrossIncome = grossScheduledIncome - vacancyLoss;

  // --- Operating Expenses ---
  const totalOperatingExpenses =
    (parseFloat(taxes) || 0) +
    (parseFloat(insurance) || 0) +
    (parseFloat(maintenance) || 0) +
    (parseFloat(propertyManagement) || 0) +
    (parseFloat(utilities) || 0) +
    (parseFloat(hoaFees) || 0) +
    (parseFloat(otherExpenses) || 0);

  // --- NOI ---
  const NOI = effectiveGrossIncome - totalOperatingExpenses;

  // --- Going-In Cap Rate ---
  const goingInCapRate = price ? (NOI / parseFloat(price)) * 100 : 0;

  // --- Effective Cap Rate ---
  const effectiveCapRate = price ? (NOI / parseFloat(price)) * 100 : 0; // Similar to going-in unless adjustments are made

  // --- Stabilized Cap Rate ---
  const annualRentGrowth = (parseFloat(rentGrowthRate) || 0) / 100;
  const annualExpenseGrowth = (parseFloat(expenseGrowthRate) || 0) / 100;
  const stabilizedNOI =
    annualRent * Math.pow(1 + annualRentGrowth, holdingPeriod || 1) +
    otherIncomeTotal -
    totalOperatingExpenses *
      Math.pow(1 + annualExpenseGrowth, holdingPeriod || 1);
  const stabilizedCapRate = price
    ? (stabilizedNOI / parseFloat(price)) * 100
    : 0;

  // --- Exit Cap Rate ---
  const exitNOI = stabilizedNOI; // Assuming stabilized NOI at sale
  const exitCapRateValue = exitValue
    ? (exitNOI / parseFloat(exitValue)) * 100
    : parseFloat(exitCapRate) || 0;

  // --- Break-even Occupancy ---
  const breakEvenOccupancy = grossScheduledIncome
    ? (totalOperatingExpenses / grossScheduledIncome) * 100
    : 0;

  // --- Expense Ratio ---
  const expenseRatio = effectiveGrossIncome
    ? (totalOperatingExpenses / effectiveGrossIncome) * 100
    : 0;

  return {
    NOI,
    grossScheduledIncome,
    effectiveGrossIncome,
    totalOperatingExpenses,
    goingInCapRate,
    effectiveCapRate,
    stabilizedCapRate,
    exitCapRateValue,
    breakEvenOccupancy,
    expenseRatio,
  };
}
