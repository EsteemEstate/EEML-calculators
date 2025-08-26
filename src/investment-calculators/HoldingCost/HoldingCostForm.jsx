// src/investment-calculators/HoldingCost/HoldingCostForm.jsx
import React, { useState } from "react";
import { calculateHoldingCosts } from "../../Utils/HoldingCostFormulas"; // to be implemented
import "../../styles/HoldingCostCalculator.css";

const SectionTitleWithTooltip = ({ title, description }) => (
  <div className="section-title-container">
    <h2 className="section-title">{title}</h2>
    <div className="tooltip">
      <span className="tooltip-text">{description}</span>
    </div>
  </div>
);

// Default placeholder inputs
const initialInputs = {
  // A) Property & Financing
  purchasePrice: "",
  loanAmount: "",
  mortgageRate: "",
  loanTerm: "",
  monthlyPI: "",

  // B) Fixed Ownership Costs
  propertyTax: "",
  insurance: "",
  hoaFee: "",
  maintenance: "",
  utilities: "",
  securityLandscaping: "",

  // C) Transaction / Opportunity Costs
  closingCosts: "",
  stampDuty: "",
  opportunityCost: "",

  // D) Revenue Offsets
  rentalIncome: "",
  vacancyRate: "",
  taxDeductions: false, // keep boolean

  // E) Locale & Currency
  country: "",
  currency: "",
  exchangeRate: "",

  // Dev toggles
  dataExport: false, // keep boolean
};

function HoldingCostForm({ setResults }) {
  const [inputs, setInputs] = useState(initialInputs);

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
    e.preventDefault();
    const calculatedResults = calculateHoldingCosts(inputs); // make sure the function name matches
    setResults(calculatedResults); // ✅ this must update the parent state
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* A) Property & Financing */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="A) Property & Financing"
          description="Purchase price, loan terms, and mortgage details"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Purchase Price ({inputs.currency})</label>
            <input
              name="purchasePrice"
              type="number"
              value={inputs.purchasePrice}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Loan Amount / Mortgage Balance</label>
            <input
              name="loanAmount"
              type="number"
              value={inputs.loanAmount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Mortgage Rate (%)</label>
            <input
              name="mortgageRate"
              type="number"
              value={inputs.mortgageRate}
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
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Monthly Principal & Interest (optional)</label>
            <input
              name="monthlyPI"
              type="number"
              value={inputs.monthlyPI}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* B) Fixed Ownership Costs */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="B) Fixed Ownership Costs"
          description="Taxes, insurance, HOA, utilities, maintenance"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Property Tax (% annual or fixed)</label>
            <input
              name="propertyTax"
              type="number"
              value={inputs.propertyTax}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Insurance (annual)</label>
            <input
              name="insurance"
              type="number"
              value={inputs.insurance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>HOA / Strata Fees (monthly)</label>
            <input
              name="hoaFee"
              type="number"
              value={inputs.hoaFee}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Maintenance & Repairs (monthly)</label>
            <input
              name="maintenance"
              type="number"
              value={inputs.maintenance}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Utilities (monthly)</label>
            <input
              name="utilities"
              type="number"
              value={inputs.utilities}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Security / Landscaping / Pool (monthly)</label>
            <input
              name="securityLandscaping"
              type="number"
              value={inputs.securityLandscaping}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* C) Transaction / Opportunity Costs */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="C) Transaction / Opportunity Costs"
          description="Upfront closing costs, stamp duty, and equity opportunity costs"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Closing Costs (upfront)</label>
            <input
              name="closingCosts"
              type="number"
              value={inputs.closingCosts}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Stamp Duty / Transfer Taxes</label>
            <input
              name="stampDuty"
              type="number"
              value={inputs.stampDuty}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Opportunity Cost of Equity (%)</label>
            <input
              name="opportunityCost"
              type="number"
              value={inputs.opportunityCost}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* D) Revenue Offsets */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="D) Revenue Offsets"
          description="Rental income, vacancy rate, and tax deductions"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Rental Income (monthly)</label>
            <input
              name="rentalIncome"
              type="number"
              value={inputs.rentalIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Vacancy Rate (%)</label>
            <input
              name="vacancyRate"
              type="number"
              value={inputs.vacancyRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="taxDeductions"
                checked={inputs.taxDeductions}
                onChange={handleChange}
              />
              Enable Tax Deductions (interest / depreciation)
            </label>
          </div>
        </div>
      </div>

      {/* E) Locale & Currency */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="E) Locale & Currency"
          description="Country settings, currency, exchange rates"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Country / Locale</label>
            <select
              name="country"
              value={inputs.country}
              onChange={handleChange}
            >
              <option value="US">United States</option>
              <option value="TT">Trinidad & Tobago</option>
              <option value="UK">United Kingdom</option>
              <option value="AE">United Arab Emirates</option>
            </select>
          </div>
          <div className="form-group">
            <label>Currency</label>
            <input
              name="currency"
              type="text"
              value={inputs.currency}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Exchange Rate (to USD)</label>
            <input
              name="exchangeRate"
              type="number"
              value={inputs.exchangeRate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Technical Options */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Technical Options"
          description="Enable export and data sharing"
        />
        <div className="form-row">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="dataExport"
                checked={inputs.dataExport}
                onChange={handleChange}
              />
              Enable Data Export (PDF, CSV, Link)
            </label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="form-section">
        <button type="submit" className="submit-button">
          Calculate Holding Costs
        </button>
      </div>
    </form>
  );
}

export default HoldingCostForm;
