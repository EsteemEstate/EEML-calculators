export function calculateROI({
  price,
  rent,
  expenses,
  appreciationRate,
  holdingPeriod,
}) {
  const netAnnualIncome = (rent - expenses) * 12;
  const annualAppreciationRateDecimal = appreciationRate / 100; // Convert percentage to decimal

  // Calculate the future value of the property due to appreciation
  const futurePropertyValue =
    price * Math.pow(1 + annualAppreciationRateDecimal, holdingPeriod);

  // Calculate the total capital gain from appreciation
  const capitalGain = futurePropertyValue - price;

  // Calculate total income from rent over the holding period
  const totalRentalIncome = netAnnualIncome * holdingPeriod;

  // Total return is the sum of capital gain and total rental income
  const totalReturn = capitalGain + totalRentalIncome;

  // Calculate ROI as (Total Return / Initial Investment) * 100
  const roi = (totalReturn / price) * 100;

  // Return the ROI as a number, format it for display later
  return roi;
}
