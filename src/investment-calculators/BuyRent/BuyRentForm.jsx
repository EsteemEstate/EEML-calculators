// BuyRentForm.jsx
import React, { useState } from "react";
import { calculateBuyRent } from "../../Utils/BuyRentFormulas"; // you’ll implement formulas here
import "../../styles/BuyRentCalculator.css";

const SectionTitleWithTooltip = ({ title, description }) => (
  <div className="section-title-container">
    <h2 className="section-title">{title}</h2>
    <div className="tooltip">
      <span className="tooltip-text">{description}</span>
    </div>
  </div>
);

// Initial placeholder data
const initialPlaceholderData = {
  // Buying
  homePrice: "",
  downPayment: "",
  loanTerm: "",
  interestRate: "",
  propertyTax: "",
  insurance: "",
  maintenancePercent: "",
  hoaFee: "",
  closingCosts: "",

  // Renting
  monthlyRent: "",
  rentIncreasePercent: "",
  renterInsurance: "",

  // Shared / Market
  annualHomeAppreciation: "",
  annualInvestmentReturn: "",
  timeHorizonYears: "",

  // Scenario Adjustments
  inflationRate: "",
  rentAdjustment: "",
  homeValueAdjustment: "",

  // Dev / UI
  currency: "",
  unitSystem: "",
  dataExport: "",
};

function BuyRentForm({ setResults }) {
  const [inputs, setInputs] = useState(initialPlaceholderData);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setInputs({
      ...inputs,
      [name]:
        type === "checkbox"
          ? checked
          : value === ""
          ? ""
          : parseFloat(value) || value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents page reload
    const results = calculateBuyRent(inputs); // calculateBuyRent must return an object
    setResults(results); // update state so results column shows
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* 1. Buying Section */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Buying Inputs"
          description="Home price, mortgage, property taxes, insurance, HOA, maintenance"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Home Price ({inputs.currency})</label>
            <input
              name="homePrice"
              type="number"
              value={inputs.homePrice}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Down Payment ({inputs.currency})</label>
            <input
              name="downPayment"
              type="number"
              value={inputs.downPayment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Loan Term (years)</label>
            <input
              name="loanTerm"
              type="number"
              value={inputs.loanTerm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              name="interestRate"
              type="number"
              value={inputs.interestRate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Property Tax (annual, {inputs.currency})</label>
            <input
              name="propertyTax"
              type="number"
              value={inputs.propertyTax}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Home Insurance (annual, {inputs.currency})</label>
            <input
              name="insurance"
              type="number"
              value={inputs.insurance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Maintenance (% of home value)</label>
            <input
              name="maintenancePercent"
              type="number"
              value={inputs.maintenancePercent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>HOA Fee (monthly, {inputs.currency})</label>
            <input
              name="hoaFee"
              type="number"
              value={inputs.hoaFee}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 2. Renting Section */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Renting Inputs"
          description="Rent, annual increases, and renter’s insurance"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Monthly Rent ({inputs.currency})</label>
            <input
              name="monthlyRent"
              type="number"
              value={inputs.monthlyRent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Annual Rent Increase (%)</label>
            <input
              name="rentIncreasePercent"
              type="number"
              value={inputs.rentIncreasePercent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Renter’s Insurance (annual, {inputs.currency})</label>
            <input
              name="renterInsurance"
              type="number"
              value={inputs.renterInsurance}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 3. Market Assumptions */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Market Assumptions"
          description="Appreciation, investment returns, time horizon"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Annual Home Appreciation (%)</label>
            <input
              name="annualHomeAppreciation"
              type="number"
              value={inputs.annualHomeAppreciation}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Annual Investment Return (%)</label>
            <input
              name="annualInvestmentReturn"
              type="number"
              value={inputs.annualInvestmentReturn}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Time Horizon (years)</label>
            <input
              name="timeHorizonYears"
              type="number"
              value={inputs.timeHorizonYears}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 4. Scenario Adjustments */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Scenario Adjustments"
          description="Inflation, rent shocks, home value shifts"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Inflation Rate (%)</label>
            <input
              name="inflationRate"
              type="number"
              value={inputs.inflationRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Rent Adjustment (%)</label>
            <input
              name="rentAdjustment"
              type="number"
              value={inputs.rentAdjustment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Home Value Adjustment (%)</label>
            <input
              name="homeValueAdjustment"
              type="number"
              value={inputs.homeValueAdjustment}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 5. Technical / Dev Options */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Technical / Developer Options"
          description="Units, export options"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Unit System</label>
            <select
              name="unitSystem"
              value={inputs.unitSystem}
              onChange={handleChange}
            >
              <option value="Metric">Metric</option>
              <option value="Imperial">Imperial</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="dataExport"
                checked={inputs.dataExport}
                onChange={handleChange}
              />
              Enable Data Export
            </label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="form-section">
        <button type="submit" className="submit-button">
          Compare Buy vs Rent
        </button>
      </div>
    </form>
  );
}

export default BuyRentForm;
