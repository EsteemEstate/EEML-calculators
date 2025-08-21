// src/Utils/BuyRentFormulas.js

export function calculateBuyRent(inputs) {
  const {
    homePrice,
    downPayment,
    loanTerm,
    interestRate,
    propertyTax,
    insurance,
    maintenancePercent,
    hoaFee,
    closingCosts,
    monthlyRent,
    rentIncreasePercent,
    renterInsurance,
    annualHomeAppreciation,
    annualInvestmentReturn,
    timeHorizonYears,
    inflationRate,
    rentAdjustment,
    homeValueAdjustment,
    currency,
  } = inputs;

  // 1️⃣ Mortgage calculation (monthly)
  const principal = homePrice - downPayment;
  const monthlyRate = interestRate / 12;
  const nPayments = loanTerm * 12;
  const mortgagePayment =
    monthlyRate === 0
      ? principal / nPayments
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -nPayments));

  // 2️⃣ Annual costs for buying
  const annualMortgage = mortgagePayment * 12;
  const annualHOA = hoaFee * 12;
  const annualMaintenance = homePrice * maintenancePercent;
  const annualPropertyTax = homePrice * propertyTax;
  const annualInsurance = insurance;

  const totalAnnualBuyCost =
    annualMortgage +
    annualHOA +
    annualMaintenance +
    annualPropertyTax +
    annualInsurance;

  // 3️⃣ Future value of home
  let homeValueFV = homePrice;
  for (let i = 1; i <= timeHorizonYears; i++) {
    homeValueFV *= 1 + annualHomeAppreciation + homeValueAdjustment;
  }

  // 4️⃣ Equity accumulated over horizon (approx)
  const totalMortgagePaid = Math.min(
    annualMortgage * timeHorizonYears,
    principal
  );
  const homeEquity =
    downPayment + totalMortgagePaid + (homeValueFV - homePrice);

  // 5️⃣ Renting: total rent payments over horizon
  let totalRent = 0;
  let currentRent = monthlyRent;
  for (let i = 1; i <= timeHorizonYears; i++) {
    totalRent += currentRent * 12 + renterInsurance;
    currentRent *= 1 + rentIncreasePercent + rentAdjustment;
  }

  // 6️⃣ Investing difference
  // Money saved by renting instead of buying upfront
  const buyInitial = downPayment + closingCosts;
  const rentSavings = buyInitial; // amount you could invest instead of buying down payment
  let investmentRentFV = rentSavings;
  for (let i = 1; i <= timeHorizonYears; i++) {
    investmentRentFV *= 1 + annualInvestmentReturn;
  }

  // 7️⃣ Wealth if buying
  const buyWealth = homeEquity;

  // 8️⃣ Wealth if renting
  const rentWealth = investmentRentFV;

  // 9️⃣ Net worth delta
  const netWorthDelta = buyWealth - rentWealth;

  // 10️⃣ Break-even year (approx)
  let breakEvenYear = "Never";
  let runningBuyEquity = downPayment;
  let runningRentInvestment = rentSavings;
  currentRent = monthlyRent;
  for (let year = 1; year <= timeHorizonYears; year++) {
    runningBuyEquity += annualHomeAppreciation * homePrice; // approximate yearly appreciation
    runningRentInvestment *= 1 + annualInvestmentReturn;
    if (runningBuyEquity >= runningRentInvestment) {
      breakEvenYear = year;
      break;
    }
  }

  // 11️⃣ Return all required fields
  return {
    breakEvenYear,
    netWorthDelta,
    buyWealth,
    rentWealth,
    totalBuyCosts: totalAnnualBuyCost * timeHorizonYears + closingCosts,
    totalRentCosts: totalRent,
    investmentBuy: buyInitial, // amount invested if buying
    investmentRent: investmentRentFV, // investment growth if renting
    homeEquity,
    currency,
  };
}
