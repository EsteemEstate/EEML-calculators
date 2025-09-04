// src/investment-calculators/Mortgage/MortgageForm.jsx
import React, { useState } from "react";
import { calculateMortgage } from "../../F&A utils/MortgageFormulas";
import "../../F&A styles/MortgageCalculator.css";

const SectionTitleWithTooltip = ({ title, description }) => (
  <div className="section-title-container">
    <h3 className="section-title">{title}</h3>
    {description && (
      <div className="tooltip section-tooltip">
        ℹ️
        <span className="tooltip-text">{description}</span>
      </div>
    )}
  </div>
);

const HelpIcon = ({ tooltip }) => (
  <div className="help-icon">
    <div className="tooltip">
      ℹ️
      <span className="tooltip-text">{tooltip}</span>
    </div>
  </div>
);

function MortgageForm({ setResults }) {
  const [inputs, setInputs] = useState({
    // Core
    homePrice: 350000,
    downPayment: 70000,
    downPaymentPercent: 20,
    loanTermYears: 30,
    interestRate: 6.5,

    // Taxes & Insurance
    annualPropertyTax: 4200,
    annualInsurance: 1500,
    monthlyHOA: 200,
    pmiPercent: 0.5, // % of loan annually if <20% down

    // Extra Payment Options
    extraMonthlyPayment: 0,
    lumpSumPayment: 0,
    paymentStartDate: "2025-01",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value === "" ? "" : isNaN(value) ? value : parseFloat(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const results = calculateMortgage(inputs);
      setResults(results);
    } catch (error) {
      console.error("Calculation error:", error);
      alert("Error in calculation. Please check your inputs.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mortgage-form">
      {/* Property & Loan Basics */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Property & Loan Basics"
          description="Enter the key details for your mortgage"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Home Price ($)</label>
            <input
              type="number"
              name="homePrice"
              value={inputs.homePrice}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Down Payment ($)</label>
            <input
              type="number"
              name="downPayment"
              value={inputs.downPayment}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Down Payment (%)</label>
            <input
              type="number"
              step="0.1"
              name="downPaymentPercent"
              value={inputs.downPaymentPercent}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Loan Term (Years)</label>
            <input
              type="number"
              name="loanTermYears"
              value={inputs.loanTermYears}
              onChange={handleChange}
              min="1"
              max="40"
            />
          </div>

          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              name="interestRate"
              value={inputs.interestRate}
              onChange={handleChange}
              min="0"
              max="50"
            />
          </div>
        </div>
      </div>

      {/* Taxes & Insurance */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Taxes & Insurance"
          description="These costs are added to your monthly mortgage payment"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Annual Property Taxes ($)</label>
            <input
              type="number"
              name="annualPropertyTax"
              value={inputs.annualPropertyTax}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Annual Insurance ($)</label>
            <input
              type="number"
              name="annualInsurance"
              value={inputs.annualInsurance}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Monthly HOA Fees ($)</label>
            <input
              type="number"
              name="monthlyHOA"
              value={inputs.monthlyHOA}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <div className="label-container">
              <label>PMI (%)</label>
              <HelpIcon tooltip="Private Mortgage Insurance, typically required with <20% down payment" />
            </div>
            <input
              type="number"
              step="0.01"
              name="pmiPercent"
              value={inputs.pmiPercent}
              onChange={handleChange}
              min="0"
              max="5"
            />
          </div>
        </div>
      </div>

      {/* Extra Payment Options */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Extra Payments"
          description="Model how additional payments can reduce loan cost and term"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Extra Monthly Payment ($)</label>
            <input
              type="number"
              name="extraMonthlyPayment"
              value={inputs.extraMonthlyPayment}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>One-Time Lump Sum ($)</label>
            <input
              type="number"
              name="lumpSumPayment"
              value={inputs.lumpSumPayment}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="month"
              name="paymentStartDate"
              value={inputs.paymentStartDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="form-section">
        <button type="submit" className="submit-button">
          Calculate Mortgage
        </button>
      </div>
    </form>
  );
}

export default MortgageForm;
