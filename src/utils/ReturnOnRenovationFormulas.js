// src/Utils/ReturnOnRenovationFormulas.js
/**
 * Comprehensive formulas for Return on Renovation Calculator
 * Supports multiple valuation methods and advanced features
 */

export function calculateRenovationROI(inputs) {
  const {
    currentValue = 0,
    renovationCosts = 0,
    appraisalUpliftPercent = 0,
    rentIncreasePercent = 0,
    currentRent = 0,
    capRate = 0.06,
    holdPeriodYears = 5,
    sellingCostsPercent = 0.06,
    fundingSource = "cash",
    helocRate = 0,
    refiRate = 0,
    renoEvents = [],
    taxRate = 0,
    depreciationRecapture = 0,
  } = inputs;

  // Calculate total renovation cost from events or single input
  const totalRenovationCost =
    renoEvents.length > 0
      ? renoEvents.reduce((sum, event) => sum + (event.cost || 0), 0)
      : renovationCosts;

  // Calculate value increase using multiple methods
  const valueIncreaseFromAppraisal =
    currentValue * (appraisalUpliftPercent / 100);
  const monthlyRentIncrease = currentRent * (rentIncreasePercent / 100);
  const annualRentIncrease = monthlyRentIncrease * 12;
  const valueIncreaseFromIncome =
    capRate > 0 ? annualRentIncrease / (capRate / 100) : 0;

  // Use the higher of the two valuation methods
  const valueIncrease = Math.max(
    valueIncreaseFromAppraisal,
    valueIncreaseFromIncome
  );

  // --- Property Value after Renovation ---
  const newValue = currentValue + valueIncrease;

  // --- Equity Created ---
  const equityCreated = valueIncrease - totalRenovationCost;

  // --- ROI (Return on Renovation) ---
  const roi = totalRenovationCost > 0 ? equityCreated / totalRenovationCost : 0;

  // --- Payback Period from Rent Increase ---
  const paybackYears =
    annualRentIncrease > 0 ? totalRenovationCost / annualRentIncrease : null;

  // --- Net After Sale (if sold after horizon) ---
  const sellingCosts = newValue * (sellingCostsPercent / 100);
  const capitalGainsTax =
    (newValue - currentValue - totalRenovationCost) * (taxRate / 100);
  const netSaleProceeds = newValue - sellingCosts - capitalGainsTax;
  const netGainAfterSale = netSaleProceeds - currentValue - totalRenovationCost;

  // --- Annualized Return (CAGR) ---
  const cagr =
    holdPeriodYears > 0 && totalRenovationCost > 0
      ? Math.pow(
          (netGainAfterSale + totalRenovationCost) / totalRenovationCost,
          1 / holdPeriodYears
        ) - 1
      : 0;

  return {
    currentValue,
    renovationCost: totalRenovationCost,
    valueIncrease,
    newValue,
    equityCreated,
    roi, // simple ROI on renovation spend
    roiPercent: roi * 100,
    annualRentGain: annualRentIncrease,
    monthlyRentIncrease,
    paybackYears,
    netSaleProceeds,
    netGainAfterSale,
    annualizedROI: cagr,
    sellingCosts,
    capitalGainsTax,
    breakdown:
      renoEvents.length > 0
        ? renoEvents
        : [{ label: "Renovation Cost", amount: totalRenovationCost }],
    valuationMethods: {
      appraisal: valueIncreaseFromAppraisal,
      income: valueIncreaseFromIncome,
      used:
        valueIncreaseFromAppraisal >= valueIncreaseFromIncome
          ? "appraisal"
          : "income",
    },
  };
}

// Add alias for backward compatibility
export { calculateRenovationROI as calculateRenoROI };
