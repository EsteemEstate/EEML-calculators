import React from "react";

function ROIResults({ results }) {
  if (!results) return null;

  // Ensure ROI is formatted to 2 decimal places for display
  const formattedROI = parseFloat(results.roi).toFixed(2);

  // Calculate future property value for display
  const annualAppreciationRateDecimal = results.appreciationRate / 100;
  const futurePropertyValue =
    results.price *
    Math.pow(1 + annualAppreciationRateDecimal, results.holdingPeriod);
  const formattedFuturePropertyValue = futurePropertyValue.toLocaleString(
    "en-US",
    { style: "currency", currency: "USD" }
  );

  return (
    <div className="results">
      <h3>Calculated ROI: {formattedROI}%</h3>
      <p>Net Annual Income: ${(results.rent - results.expenses) * 12}</p>
      <p>Holding Period: {results.holdingPeriod} years</p>
      <p>Projected Future Property Value: {formattedFuturePropertyValue}</p>
    </div>
  );
}

export default ROIResults;
