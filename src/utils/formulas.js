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
