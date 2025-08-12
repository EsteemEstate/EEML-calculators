import React, { useState } from "react";

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
    <form className="calculator-form" onSubmit={handleSubmit}>
      <h3>Property Details</h3>
      <input
        type="number"
        name="propertyPrice"
        placeholder="Property Price ($)"
        value={formData.propertyPrice}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="monthlyRent"
        placeholder="Monthly Rent ($)"
        value={formData.monthlyRent}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="otherIncome"
        placeholder="Other Annual Income ($)"
        value={formData.otherIncome}
        onChange={handleChange}
      />
      <input
        type="number"
        name="vacancyRate"
        placeholder="Vacancy Rate (%)"
        value={formData.vacancyRate}
        onChange={handleChange}
      />

      <h3>Acquisition Costs</h3>
      <input
        type="number"
        name="stampDuty"
        placeholder="Stamp Duty ($)"
        value={formData.stampDuty}
        onChange={handleChange}
      />
      <input
        type="number"
        name="legalFees"
        placeholder="Legal Fees ($)"
        value={formData.legalFees}
        onChange={handleChange}
      />
      <input
        type="number"
        name="registrationFees"
        placeholder="Registration Fees ($)"
        value={formData.registrationFees}
        onChange={handleChange}
      />
      <input
        type="number"
        name="agentFees"
        placeholder="Agent Fees ($)"
        value={formData.agentFees}
        onChange={handleChange}
      />
      <input
        type="number"
        name="renovationCosts"
        placeholder="Renovation Costs ($)"
        value={formData.renovationCosts}
        onChange={handleChange}
      />

      <h3>Financing</h3>
      <input
        type="number"
        name="mortgageAmount"
        placeholder="Mortgage Amount ($)"
        value={formData.mortgageAmount}
        onChange={handleChange}
      />
      <input
        type="number"
        step="0.01"
        name="interestRate"
        placeholder="Interest Rate (%)"
        value={formData.interestRate}
        onChange={handleChange}
      />
      <input
        type="number"
        name="loanTerm"
        placeholder="Loan Term (years)"
        value={formData.loanTerm}
        onChange={handleChange}
      />
      <select name="loanType" value={formData.loanType} onChange={handleChange}>
        <option value="P+I">Principal + Interest</option>
        <option value="InterestOnly">Interest Only</option>
      </select>

      <h3>Operating Expenses</h3>
      <input
        type="number"
        name="managementFees"
        placeholder="Management Fees ($/yr)"
        value={formData.managementFees}
        onChange={handleChange}
      />
      <input
        type="number"
        name="maintenance"
        placeholder="Maintenance ($/yr)"
        value={formData.maintenance}
        onChange={handleChange}
      />
      <input
        type="number"
        name="propertyTaxes"
        placeholder="Property Taxes ($/yr)"
        value={formData.propertyTaxes}
        onChange={handleChange}
      />
      <input
        type="number"
        name="insurance"
        placeholder="Insurance ($/yr)"
        value={formData.insurance}
        onChange={handleChange}
      />
      <input
        type="number"
        name="utilities"
        placeholder="Utilities ($/yr)"
        value={formData.utilities}
        onChange={handleChange}
      />
      <input
        type="number"
        name="hoaFees"
        placeholder="HOA Fees ($/yr)"
        value={formData.hoaFees}
        onChange={handleChange}
      />
      <input
        type="number"
        name="security"
        placeholder="Security ($/yr)"
        value={formData.security}
        onChange={handleChange}
      />
      <input
        type="number"
        name="cleaning"
        placeholder="Cleaning ($/yr)"
        value={formData.cleaning}
        onChange={handleChange}
      />
      <input
        type="number"
        name="marketing"
        placeholder="Marketing ($/yr)"
        value={formData.marketing}
        onChange={handleChange}
      />
      <input
        type="number"
        name="legalAccounting"
        placeholder="Legal/Accounting ($/yr)"
        value={formData.legalAccounting}
        onChange={handleChange}
      />
      <input
        type="number"
        name="vacancyAllowance"
        placeholder="Vacancy Allowance ($)"
        value={formData.vacancyAllowance}
        onChange={handleChange}
      />

      <button type="submit" className="calculate-btn">
        Calculate Yield
      </button>
    </form>
  );
};

export default RentalYieldForm;
