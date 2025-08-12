import React, { useState } from "react";
import SectionTitleWithTooltip from "../../components/SectionTitleWithTooltip";

const RentalYieldForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    propertyPrice: "",
    monthlyRent: "",
    otherIncome: "",
    vacancyRate: 5,
    stampDuty: "",
    legalFees: "",
    registrationFees: "",
    agentFees: "",
    renovationCosts: "",
    mortgageAmount: "",
    interestRate: "",
    loanTerm: "",
    loanType: "P+I",
    managementFees: "",
    maintenance: "",
    propertyTaxes: "",
    insurance: "",
    utilities: "",
    hoaFees: "",
    security: "",
    cleaning: "",
    marketing: "",
    legalAccounting: "",
    vacancyAllowance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {/* Property Details Section */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Property Details"
          description="Enter the details of the property you are renting."
        />
        <div className="input-grid">
          <div className="form-group">
            <label>Property Price ($)</label>
            <input
              type="number"
              name="propertyPrice"
              value={formData.propertyPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Monthly Rent ($)</label>
            <input
              type="number"
              name="monthlyRent"
              value={formData.monthlyRent}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Other Annual Income ($)</label>
            <input
              type="number"
              name="otherIncome"
              value={formData.otherIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Vacancy Rate (%)</label>
            <input
              type="number"
              name="vacancyRate"
              value={formData.vacancyRate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Acquisition Costs Section */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Acquisition Costs"
          description="Enter the costs associated with acquiring the property."
        />
        <div className="input-grid">
          <div className="form-group">
            <label>Stamp Duty ($)</label>
            <input
              type="number"
              name="stampDuty"
              value={formData.stampDuty}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Legal Fees ($)</label>
            <input
              type="number"
              name="legalFees"
              value={formData.legalFees}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Registration Fees ($)</label>
            <input
              type="number"
              name="registrationFees"
              value={formData.registrationFees}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Agent Fees ($)</label>
            <input
              type="number"
              name="agentFees"
              value={formData.agentFees}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Renovation Costs ($)</label>
            <input
              type="number"
              name="renovationCosts"
              value={formData.renovationCosts}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Financing Section */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Financing"
          description="Enter the financing details for the property."
        />
        <div className="input-grid">
          <div className="form-group">
            <label>Mortgage Amount ($)</label>
            <input
              type="number"
              name="mortgageAmount"
              value={formData.mortgageAmount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Loan Term (years)</label>
            <input
              type="number"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Loan Type</label>
            <select
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
            >
              <option value="P+I">Principal + Interest</option>
              <option value="InterestOnly">Interest Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Operating Expenses Section */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Operating Expenses"
          description="Enter the annual operating expenses for the property."
        />
        <div className="input-grid">
          <div className="form-group">
            <label>Management Fees ($/yr)</label>
            <input
              type="number"
              name="managementFees"
              value={formData.managementFees}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Maintenance ($/yr)</label>
            <input
              type="number"
              name="maintenance"
              value={formData.maintenance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Property Taxes ($/yr)</label>
            <input
              type="number"
              name="propertyTaxes"
              value={formData.propertyTaxes}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Insurance ($/yr)</label>
            <input
              type="number"
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Utilities ($/yr)</label>
            <input
              type="number"
              name="utilities"
              value={formData.utilities}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>HOA Fees ($/yr)</label>
            <input
              type="number"
              name="hoaFees"
              value={formData.hoaFees}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Security ($/yr)</label>
            <input
              type="number"
              name="security"
              value={formData.security}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Cleaning ($/yr)</label>
            <input
              type="number"
              name="cleaning"
              value={formData.cleaning}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Marketing ($/yr)</label>
            <input
              type="number"
              name="marketing"
              value={formData.marketing}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Legal/Accounting ($/yr)</label>
            <input
              type="number"
              name="legalAccounting"
              value={formData.legalAccounting}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Vacancy Allowance ($)</label>
            <input
              type="number"
              name="vacancyAllowance"
              value={formData.vacancyAllowance}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button">
        Calculate Yield
      </button>
    </form>
  );
};

export default RentalYieldForm;
