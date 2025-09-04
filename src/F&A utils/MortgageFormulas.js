export function calculateMortgage(inputs) {
  const {
    homePrice,
    downPayment,
    loanTermYears,
    interestRate,
    annualPropertyTax,
    annualInsurance,
    monthlyHOA,
    pmiPercent,
    extraMonthlyPayment,
    lumpSumPayment,
  } = inputs;

  // Core loan calculations
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // Monthly principal & interest
  const monthlyPrincipalAndInterest =
    (loanAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  // Monthly additional costs
  const monthlyTaxes = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyPMI =
    pmiPercent > 0 ? (loanAmount * (pmiPercent / 100)) / 12 : 0;

  // Total monthly payment
  const totalMonthlyPayment =
    monthlyPrincipalAndInterest +
    monthlyTaxes +
    monthlyInsurance +
    monthlyHOA +
    monthlyPMI +
    extraMonthlyPayment;

  // Totals over the loan term
  const totalPrincipalPaid = loanAmount;
  const totalInterestPaid =
    monthlyPrincipalAndInterest * numberOfPayments - loanAmount;
  const totalTaxes = monthlyTaxes * numberOfPayments;
  const totalInsurance = monthlyInsurance * numberOfPayments;
  const totalHOA = monthlyHOA * numberOfPayments;
  const totalPMI = monthlyPMI * numberOfPayments;
  const totalCostOfLoan =
    totalPrincipalPaid +
    totalInterestPaid +
    totalTaxes +
    totalInsurance +
    totalHOA +
    totalPMI;

  // Payoff time
  const payoffYears = loanTermYears;
  const payoffMonths = 0;

  // Amortization schedule with cumulative values
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;
  let remainingBalance = loanAmount;

  const amortizationSchedule = Array.from(
    { length: numberOfPayments },
    (_, i) => {
      const month = i + 1;
      const interestPayment = remainingBalance * monthlyRate;
      let principalPayment = monthlyPrincipalAndInterest - interestPayment;

      // Adjust for extra monthly payment
      principalPayment += extraMonthlyPayment;

      cumulativePrincipal += principalPayment;
      cumulativeInterest += interestPayment;
      remainingBalance = Math.max(loanAmount - cumulativePrincipal, 0);

      return {
        month,
        cumulativePrincipal: parseFloat(cumulativePrincipal.toFixed(2)),
        cumulativeInterest: parseFloat(cumulativeInterest.toFixed(2)),
        remainingBalance: parseFloat(remainingBalance.toFixed(2)),
        principalPayment: parseFloat(principalPayment.toFixed(2)),
        interestPayment: parseFloat(interestPayment.toFixed(2)),
      };
    }
  );

  // Breakdown for charts (monthly values)
  const breakdown = [
    { label: "Principal", amount: monthlyPrincipalAndInterest },
    {
      label: "Interest",
      amount:
        monthlyPrincipalAndInterest * (totalInterestPaid / totalPrincipalPaid),
    }, // approximate
    { label: "Taxes", amount: monthlyTaxes },
    { label: "Insurance", amount: monthlyInsurance },
    { label: "HOA", amount: monthlyHOA },
    { label: "PMI", amount: monthlyPMI },
  ];

  // Savings from extra payments
  const savingsFromExtraPayments =
    extraMonthlyPayment * numberOfPayments + lumpSumPayment;

  return {
    loanAmount,
    monthlyPrincipalAndInterest,
    monthlyTaxes,
    monthlyInsurance,
    monthlyHOA,
    monthlyPMI,
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
    savingsFromExtraPayments,
    breakdown,
  };
}
