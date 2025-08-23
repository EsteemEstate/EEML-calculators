// src/Utils/HoldingCostFormulas.js
export function calculateHoldingCosts(inputs) {
  if (!inputs) return null;

  const {
    purchasePrice,
    loanAmount,
    mortgageRate,
    loanTerm,
    monthlyPI,
    propertyTax,
    insurance,
    hoaFee,
    maintenance,
    utilities,
    securityLandscaping,
    closingCosts,
    stampDuty,
    opportunityCost,
    rentalIncome,
    vacancyRate,
    sizeSqFt, // ✅ Added to inputs destructuring
    currency,
  } = inputs;

  // 1️⃣ Mortgage P&I
  let monthlyInterest = mortgageRate / 12;
  let nMonths = loanTerm * 12;
  let monthlyMortgage =
    monthlyPI && monthlyPI > 0
      ? monthlyPI
      : loanAmount > 0
      ? (loanAmount * monthlyInterest) /
        (1 - Math.pow(1 + monthlyInterest, -nMonths))
      : 0;

  // 2️⃣ Fixed Ownership Costs
  const monthlyPropertyTax =
    propertyTax < 1 ? (purchasePrice * propertyTax) / 12 : propertyTax / 12;
  const monthlyInsurance = insurance / 12;
  const monthlyHOA = hoaFee;
  const monthlyMaintenance = maintenance;
  const monthlyUtilities = utilities;
  const monthlySecurity = securityLandscaping;

  // 3️⃣ Opportunity Cost of Equity
  const equity = purchasePrice - loanAmount;
  const monthlyOpportunityCost = equity * (opportunityCost / 12);

  // 4️⃣ Revenue offsets
  const effectiveRentalIncome =
    rentalIncome * (1 - (vacancyRate ? vacancyRate / 100 : 0));

  // 5️⃣ Total monthly holding cost
  const monthlyHoldingCost =
    monthlyMortgage +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyHOA +
    monthlyMaintenance +
    monthlyUtilities +
    monthlySecurity +
    monthlyOpportunityCost -
    effectiveRentalIncome;

  const annualHoldingCost = monthlyHoldingCost * 12;

  // 6️⃣ ✅ FIXED: Cost per Sq Ft & per Day
  let costPerSqFt = null; // ✅ Initialize as null for missing data
  // ✅ Calculate only if valid square footage is provided
  if (sizeSqFt && sizeSqFt > 0) {
    // ✅ Use ANNUAL cost per sq ft (industry standard)
    costPerSqFt = annualHoldingCost / sizeSqFt;
  }

  // ✅ Improved daily cost calculation (annual cost / 365 days)
  const costPerDay = annualHoldingCost / 365;

  // 7️⃣ Cost breakdown
  const breakdown = {
    mortgage: monthlyMortgage,
    taxes: monthlyPropertyTax,
    insurance: monthlyInsurance,
    hoa: monthlyHOA,
    maintenance: monthlyMaintenance,
    utilities: monthlyUtilities,
    security: monthlySecurity,
    opportunityCost: monthlyOpportunityCost,
  };

  // 8️⃣ Revenue Adjusted Outputs
  const netHoldingCost = monthlyHoldingCost;
  const effectiveHoldingCost = monthlyHoldingCost; // placeholder for scenario adjustments

  // 9️⃣ Comparative / Scenario Outputs (placeholders for now)
  const rentComparison = 0;
  const vacancySensitivity = 0;
  const interestRateSensitivity = 0;

  // Return results object
  return {
    monthlyHoldingCost,
    annualHoldingCost,
    costPerSqFt, // ✅ Now returns null if no valid sizeSqFt provided
    costPerDay, // ✅ Now more accurate (based on annual cost)
    breakdown,
    netHoldingCost,
    effectiveHoldingCost,
    rentComparison,
    vacancySensitivity,
    interestRateSensitivity,
    currency,
  };
}
