import React, { useState } from "react";
import RentalYieldForm from "./RentalYieldForm";
import RentalYieldResults from "./RentalYieldResults";
import RentalYieldChart from "./RentalYieldChart"; // Import your chart component
import {
  calculateGrossYield,
  calculateNetYield,
  calculateCapRate,
  calculateCashOnCash,
  calculateCashFlow,
  calculateAnnualRent,
  calculatePaybackPeriod,
  sumValues,
} from "../../utils/formulas"; // Adjust the path as necessary
import "../../styles/RentalYieldCalculator.css";

const RentalYieldCalculatorPage = () => {
  const [results, setResults] = useState(null);

  const handleCalculate = (formData) => {
    // Calculate annual rent adjusted for vacancy
    const annualRent = calculateAnnualRent(
      formData.monthlyRent,
      formData.vacancyRate
    );

    // Calculate total income
    const totalIncome = annualRent + (formData.otherIncome || 0);

    // Calculate total expenses
    const expenses = sumValues([
      formData.managementFees,
      formData.maintenance,
      formData.propertyTaxes,
      formData.insurance,
      formData.utilities,
      formData.hoaFees,
      formData.security,
      formData.cleaning,
      formData.marketing,
      formData.legalAccounting,
    ]);

    // Calculate cash flow (assuming no annual debt service for simplicity)
    const cashFlow = calculateCashFlow(totalIncome, expenses, 0); // Pass 0 for annualDebtService if not used

    // Calculate results
    const grossYield = calculateGrossYield(annualRent, formData.propertyPrice);
    const netYield = calculateNetYield(
      annualRent,
      expenses,
      formData.propertyPrice
    );
    const capRate = calculateCapRate(
      totalIncome,
      expenses,
      formData.propertyPrice
    );
    const cashOnCash = calculateCashOnCash(cashFlow, formData.downPayment); // Assuming downPayment is provided
    const paybackPeriod = calculatePaybackPeriod(
      formData.propertyPrice,
      cashFlow
    );

    // Set results
    setResults({
      grossYield,
      netYield,
      capRate,
      cashOnCash,
      annualRent,
      totalIncome,
      expenses,
      cashFlow,
      paybackPeriod,
    });
  };

  return (
    <div className="calculator-container">
      <header className="calculator-header">
        <h1>EEML Rental Yield Calculator</h1>
        <p>Analyze your rental property's potential returns</p>
      </header>

      <div className="calculator-grid">
        {/* Left Column - Form */}
        <div className="form-column">
          <RentalYieldForm onCalculate={handleCalculate} />
        </div>

        {/* Right Column - Results */}
        <div className="results-column">
          {results ? (
            <>
              <RentalYieldResults results={results} />
              <div className="chart-grid">
                <div className="chart-wrapper">
                  <RentalYieldChart data={results} />
                </div>
                {/* Add any additional charts here */}
              </div>
            </>
          ) : (
            <div className="empty-results">
              <div className="empty-icon">📊</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to see your yield analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalYieldCalculatorPage;
