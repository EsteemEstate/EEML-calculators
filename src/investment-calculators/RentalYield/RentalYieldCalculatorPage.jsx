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
      const parse = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      };

      const propertyPrice = parse(formData.propertyPrice);
      const monthlyRent = parse(formData.monthlyRent);
      const otherIncome = parse(formData.otherIncome);
      const vacancyRate = Math.min(
        Math.max(parse(formData.vacancyRate), 0),
        100
      );

      const mortgageAmount = parse(formData.mortgageAmount);
      const downPayment =
        parse(formData.downPayment) || propertyPrice - mortgageAmount;

      const acquisitionCosts = sumValues([
        parse(formData.stampDuty),
        parse(formData.legalFees),
        parse(formData.registrationFees),
        parse(formData.agentFees),
        parse(formData.renovationCosts),
        parse(formData.foreignBuyerSurcharge),
        parse(formData.valuationCosts),
        parse(formData.bankProcessingFees),
        parse(formData.recurringFitOutCosts),
      ]);

      const interestRate = parse(formData.interestRate);
      const loanTermYears = parse(formData.loanTermYears);

      if (propertyPrice <= 0 || monthlyRent <= 0) {
        throw new Error(
          "Property price and monthly rent must be positive values"
        );
      }

      const annualRent = calculateAnnualRent(monthlyRent, vacancyRate);
      const totalIncome = annualRent + otherIncome;

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
        parse(formData.badDebtAllowance),
        parse(formData.licensingFees),
        parse(formData.camRecoveries),
        parse(formData.turnoverRentClauses),
      ]);

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
        {/* Left Column - Info Box */}
        <aside className="info-column">
          <h2>What is Rental Yield?</h2>
          <p>
            Rental yield measures the annual income you earn from a property
            (through rent) as a percentage of its value or purchase price. It’s
            a key metric for comparing potential investments.
          </p>
          <h4>Two Types:</h4>
          <ul>
            <li>
              <strong>Gross Yield:</strong> Annual rent ÷ property value × 100
            </li>
            <li>
              <strong>Net Yield:</strong> (Annual rent − expenses) ÷ property
              value × 100
            </li>
          </ul>
          <p>
            A higher yield generally means better cash flow, but it’s important
            to also consider risk factors, property location, and growth
            potential.
          </p>
        </aside>

        {/* Middle Column - Form */}
        <div className="form-column">
          <RentalYieldForm onCalculate={handleCalculate} />
        </div>

        {/* Right Column - Results */}
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
