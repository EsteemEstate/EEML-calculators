import React, { useState } from "react";
import RentalYieldForm from "./RentalYieldForm";
import RentalYieldResults from "./RentalYieldResults";
import RentalYieldChart from "./RentalYieldChart";
import {
  calculateGrossYield,
  calculateNetYield,
  calculateCapRate,
  calculateCashOnCash,
  calculateCashFlow,
  calculateAnnualRent,
  calculatePaybackPeriod,
  calculateMortgagePayment,
  sumValues,
  calculateTotalCashInvested,
} from "../../utils/rentalFormulas";
import "../../styles/RentalYieldCalculator.css";

const RentalYieldCalculatorPage = () => {
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = (formData) => {
    setIsCalculating(true);
    setError(null);

    try {
      // Parse all numeric inputs with validation
      const parse = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      };

      // Property details
      const propertyPrice = parse(formData.propertyPrice);
      const monthlyRent = parse(formData.monthlyRent);
      const otherIncome = parse(formData.otherIncome);
      const vacancyRate = Math.min(
        Math.max(parse(formData.vacancyRate), 0),
        100
      ); // Clamp 0-100

      // Calculate down payment if not provided
      const mortgageAmount = parse(formData.mortgageAmount);
      const downPayment =
        parse(formData.downPayment) || propertyPrice - mortgageAmount;

      // Acquisition costs
      const acquisitionCosts = sumValues([
        parse(formData.stampDuty),
        parse(formData.legalFees),
        parse(formData.registrationFees),
        parse(formData.agentFees),
        parse(formData.renovationCosts),
      ]);

      // Financing
      const interestRate = parse(formData.interestRate);
      const loanTermYears = parse(formData.loanTermYears);

      // Validate critical inputs
      if (propertyPrice <= 0 || monthlyRent <= 0) {
        throw new Error(
          "Property price and monthly rent must be positive values"
        );
      }

      // Calculate core values
      const annualRent = calculateAnnualRent(monthlyRent, vacancyRate);
      const totalIncome = annualRent + otherIncome;

      // Expenses
      const expenses = sumValues([
        parse(formData.managementFees),
        parse(formData.maintenance),
        parse(formData.propertyTaxes),
        parse(formData.insurance),
        parse(formData.utilities),
        parse(formData.hoaFees),
        parse(formData.security),
        parse(formData.cleaning),
        parse(formData.marketing),
        parse(formData.legalAccounting),
        parse(formData.vacancyAllowance),
      ]);

      // Mortgage calculations
      const annualDebtService =
        formData.loanType === "P+I"
          ? calculateMortgagePayment(
              mortgageAmount,
              interestRate,
              loanTermYears
            ) * 12
          : mortgageAmount * (interestRate / 100);

      const cashFlow = calculateCashFlow(
        totalIncome,
        expenses,
        annualDebtService
      );
      const totalCashInvested = calculateTotalCashInvested(
        propertyPrice,
        mortgageAmount,
        acquisitionCosts
      );

      // Set results
      setResults({
        grossYield: calculateGrossYield(annualRent, propertyPrice),
        netYield: calculateNetYield(annualRent, expenses, propertyPrice),
        capRate: calculateCapRate(totalIncome - expenses, propertyPrice),
        cashOnCash: calculateCashOnCash(cashFlow, totalCashInvested),
        annualRent,
        totalIncome,
        expenses,
        cashFlow,
        paybackPeriod: calculatePaybackPeriod(totalCashInvested, cashFlow),
      });
    } catch (err) {
      console.error("Calculation error:", err);
      setError(err.message || "An error occurred during calculation");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="calculator-container">
      <header className="calculator-header">
        <h1>EEML Rental Yield Calculator</h1>
        <p>Analyze your rental property's potential returns</p>
      </header>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      <div className="calculator-grid">
        <div className="form-column">
          <RentalYieldForm onCalculate={handleCalculate} />
        </div>

        <div className="results-column">
          {isCalculating ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Calculating results...</p>
            </div>
          ) : results ? (
            <>
              <RentalYieldResults results={results} />
              <div className="chart-wrapper">
                <RentalYieldChart data={results} />
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
