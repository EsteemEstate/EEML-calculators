export const calculateBreakEven = (inputs) => {
  // 1. Calculate Total Upfront Costs
  const totalUpfrontCosts = calculateTotalUpfrontCosts(inputs);

  // 2. Calculate Monthly Mortgage Payment
  const mortgagePayment = calculateMortgagePayment(inputs);

  // 3. Calculate Monthly Operating Expenses
  const monthlyOperatingExpenses = calculateMonthlyOperatingExpenses(inputs);

  // 4. Calculate Monthly Revenue
  const monthlyRevenue = calculateMonthlyRevenue(inputs);

  // 5. Calculate Break-Even Point based on selected mode
  const breakEvenResult = calculateBreakEvenPoint(
    inputs,
    mortgagePayment,
    monthlyOperatingExpenses,
    monthlyRevenue
  );

  // 6. Calculate Key Metrics
  const metrics = calculateKeyMetrics(
    inputs,
    totalUpfrontCosts,
    mortgagePayment,
    monthlyOperatingExpenses,
    monthlyRevenue
  );

  return {
    ...breakEvenResult,
    ...metrics,
    totalUpfrontCosts,
    mortgagePayment,
    monthlyOperatingExpenses,
    monthlyRevenue,
  };
};

// ---- Helper Functions ----

const calculateTotalUpfrontCosts = (inputs) => {
  const {
    downPayment,
    closingCosts,
    rehabCost,
    furnishingsCost,
    lenderPoints,
    loanAmount,
    propertyType,
  } = inputs;

  const pointsCost =
    (parseFloat(lenderPoints) / 100) * parseFloat(loanAmount) || 0;
  const furnishings =
    propertyType === "STR" ? parseFloat(furnishingsCost) || 0 : 0;

  return (
    parseFloat(downPayment) +
    parseFloat(closingCosts) +
    parseFloat(rehabCost) +
    furnishings +
    pointsCost
  );
};

const calculateMortgagePayment = (inputs) => {
  const {
    loanAmount,
    interestRate,
    amortizationYears,
    paymentFrequency,
    interestOnlyMonths,
    secondLien,
    secondLienAmount,
    secondLienRate,
  } = inputs;

  const principal = parseFloat(loanAmount) || 0;
  const annualRate = parseFloat(interestRate) / 100 || 0;
  const periods =
    parseFloat(amortizationYears) * (paymentFrequency === "Monthly" ? 12 : 26);
  const periodicRate = annualRate / (paymentFrequency === "Monthly" ? 12 : 26);

  let payment = 0;
  if (principal > 0 && periods > 0) {
    if (periodicRate > 0) {
      payment =
        (principal * periodicRate * Math.pow(1 + periodicRate, periods)) /
        (Math.pow(1 + periodicRate, periods) - 1);
    } else {
      payment = principal / periods;
    }
  }

  // Interest-only
  const interestOnlyPayment = principal * (annualRate / 12);

  // Second lien
  let secondLienPayment = 0;
  if (secondLien && secondLienAmount > 0) {
    const slPrincipal = parseFloat(secondLienAmount) || 0;
    const slRate = parseFloat(secondLienRate) / 100 || 0;
    secondLienPayment = (slPrincipal * slRate) / 12;
  }

  return {
    regularPayment: payment + secondLienPayment,
    interestOnlyPayment:
      interestOnlyMonths > 0 ? interestOnlyPayment + secondLienPayment : null,
    monthsInterestOnly: parseInt(interestOnlyMonths) || 0,
  };
};

const calculateMonthlyOperatingExpenses = (inputs) => {
  const {
    propertyTax,
    insurance,
    hoaFee,
    utilitiesWater,
    utilitiesElectric,
    utilitiesInternet,
    utilitiesGas,
    adminCosts,
    managementFeePercent,
    maintenanceReservePercent,
    capexReservePercent,
    leasingFeePercent,
    vacancyPercent,
    badDebtPercent,
    propertyType,
    monthlyRent,
    nightlyRate,
    occupancyRate,
    cleaningFee,
    channelFeePercent,
    linenCost,
  } = inputs;

  // Convert annual to monthly for propertyTax & insurance
  const fixedExpenses = {
    propertyTax: (parseFloat(propertyTax) || 0) / 12,
    insurance: (parseFloat(insurance) || 0) / 12,
    hoaFee: parseFloat(hoaFee) || 0,
    utilities: {
      water: parseFloat(utilitiesWater) || 0,
      electric: parseFloat(utilitiesElectric) || 0,
      internet: parseFloat(utilitiesInternet) || 0,
      gas: parseFloat(utilitiesGas) || 0,
    },
    adminCosts: parseFloat(adminCosts) || 0,
  };

  const totalFixedExpenses = Object.values(fixedExpenses).reduce(
    (sum, val) =>
      sum +
      (typeof val === "object"
        ? Object.values(val).reduce((s, v) => s + v, 0)
        : val),
    0
  );

  // Variable expenses (% of gross rent)
  let grossPotentialRent =
    propertyType === "STR"
      ? (parseFloat(nightlyRate) || 0) *
        30 *
        ((parseFloat(occupancyRate) || 0) / 100)
      : parseFloat(monthlyRent) || 0;

  const variableExpenses = {
    managementFee:
      (parseFloat(managementFeePercent) / 100) * grossPotentialRent,
    maintenanceReserve:
      (parseFloat(maintenanceReservePercent) / 100) * grossPotentialRent,
    capexReserve: (parseFloat(capexReservePercent) / 100) * grossPotentialRent,
    leasingFee: (parseFloat(leasingFeePercent) / 100) * grossPotentialRent,
    vacancy: (parseFloat(vacancyPercent) / 100) * grossPotentialRent,
    badDebt: (parseFloat(badDebtPercent) / 100) * grossPotentialRent,
  };

  // STR specific
  let strExpenses = 0;
  if (propertyType === "STR") {
    const cleaning = parseFloat(cleaningFee) || 0;
    const channelFees =
      (parseFloat(channelFeePercent) / 100) * grossPotentialRent || 0;
    const linen = parseFloat(linenCost) || 0;
    strExpenses = cleaning + channelFees + linen;
  }

  const totalVariableExpenses =
    Object.values(variableExpenses).reduce((sum, val) => sum + val, 0) +
    strExpenses;

  return {
    fixed: fixedExpenses,
    variable: variableExpenses,
    strExpenses: propertyType === "STR" ? strExpenses : null,
    total: totalFixedExpenses + totalVariableExpenses,
  };
};

const calculateMonthlyRevenue = (inputs) => {
  const {
    propertyType,
    monthlyRent,
    otherIncome,
    nightlyRate,
    occupancyRate,
    seasonalUplift,
    upsells,
    rentAdjustment,
    occupancyAdjustment,
    rateAdjustment,
  } = inputs;

  const rentAdjFactor = 1 + (parseFloat(rentAdjustment) || 0) / 100;
  const occupancyAdjFactor = 1 + (parseFloat(occupancyAdjustment) || 0) / 100;
  const rateAdjFactor = 1 + (parseFloat(rateAdjustment) || 0) / 100;

  if (propertyType === "STR") {
    const baseNightlyRate = (parseFloat(nightlyRate) || 0) * rateAdjFactor;
    const baseOccupancy =
      ((parseFloat(occupancyRate) || 0) / 100) * occupancyAdjFactor;
    const currentMonth = new Date().getMonth();
    const upliftFactor = seasonalUplift?.[currentMonth] || 1;
    const adjustedNightlyRate = baseNightlyRate * upliftFactor;
    const nightsBooked = 30 * baseOccupancy;
    const rentalIncome = adjustedNightlyRate * nightsBooked;
    const cleaningIncome = (parseFloat(inputs.cleaningFee) || 0) * nightsBooked;
    const otherRev = parseFloat(upsells) || 0;
    return {
      rentalIncome,
      cleaningIncome,
      otherIncome: otherRev,
      total: rentalIncome + cleaningIncome + otherRev,
    };
  } else {
    const rentalIncome = (parseFloat(monthlyRent) || 0) * rentAdjFactor;
    const otherRev = parseFloat(otherIncome) || 0;
    return {
      rentalIncome,
      otherIncome: otherRev,
      total: rentalIncome + otherRev,
    };
  }
};

const calculateBreakEvenPoint = (
  inputs,
  mortgagePayment,
  monthlyOperatingExpenses,
  monthlyRevenue
) => {
  const { breakEvenMode, targetDSCR, targetMonthlyMargin } = inputs;

  const mortgagePmt =
    mortgagePayment.monthsInterestOnly > 0
      ? mortgagePayment.interestOnlyPayment
      : mortgagePayment.regularPayment;

  const totalMonthlyExpenses = monthlyOperatingExpenses.total + mortgagePmt;

  switch (breakEvenMode) {
    case "DSCR":
      const dscrTarget = parseFloat(targetDSCR) || 1.2;
      const requiredRevenueForDSCR = totalMonthlyExpenses * dscrTarget;
      return {
        breakEvenRevenue: requiredRevenueForDSCR,
        breakEvenRent:
          requiredRevenueForDSCR -
          (monthlyRevenue.total - monthlyRevenue.rentalIncome),
        mode: "DSCR",
        targetDSCR: dscrTarget,
      };

    case "Margin":
      const marginTarget = parseFloat(targetMonthlyMargin) || 0;
      const requiredRevenueForMargin = totalMonthlyExpenses + marginTarget;
      return {
        breakEvenRevenue: requiredRevenueForMargin,
        breakEvenRent:
          requiredRevenueForMargin -
          (monthlyRevenue.total - monthlyRevenue.rentalIncome),
        mode: "Margin",
        targetMargin: marginTarget,
      };

    case "CF=0":
    default:
      return {
        breakEvenRevenue: totalMonthlyExpenses,
        breakEvenRent:
          totalMonthlyExpenses -
          (monthlyRevenue.total - monthlyRevenue.rentalIncome),
        mode: "Cash Flow = 0",
      };
  }
};

const calculateKeyMetrics = (
  inputs,
  totalUpfrontCosts,
  mortgagePayment,
  monthlyOperatingExpenses,
  monthlyRevenue
) => {
  const { purchasePrice, loanAmount, propertyType } = inputs;

  const mortgagePmt =
    mortgagePayment.monthsInterestOnly > 0
      ? mortgagePayment.interestOnlyPayment
      : mortgagePayment.regularPayment;

  const noi = monthlyRevenue.total - monthlyOperatingExpenses.total;
  const cashFlow = noi - mortgagePmt;
  const capRate = (noi * 12) / parseFloat(purchasePrice);
  const dscr = noi / mortgagePmt;
  const cocROI = (cashFlow * 12) / totalUpfrontCosts;
  const ltv = (parseFloat(loanAmount) / parseFloat(purchasePrice)) * 100;

  let strMetrics = {};
  if (propertyType === "STR") {
    const avgNightlyRate = parseFloat(inputs.nightlyRate) || 0;
    const occupancy = (parseFloat(inputs.occupancyRate) || 0) / 100;
    strMetrics = {
      revPar: avgNightlyRate * occupancy,
      adr: avgNightlyRate,
      annualOccupancy: occupancy * 100,
    };
  }

  return {
    noi,
    cashFlow,
    capRate,
    dscr,
    cocROI,
    ltv,
    ...strMetrics,
  };
};
