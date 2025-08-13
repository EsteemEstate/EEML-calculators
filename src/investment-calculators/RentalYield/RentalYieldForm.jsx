import React, { useState } from "react";
import SectionTitleWithTooltip from "../../components/SectionTitleWithTooltip";

const RentalYieldForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    propertyPrice: "",
    monthlyRent: "",
    otherIncome: "",
    vacancyRate: "",
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
    propertyType: "", // New field
    size: "", // New field
    numberOfUnits: "", // New field
    ageCondition: "", // New field
    occupancyStatus: "", // New field
    foreignBuyerSurcharge: "", // New field
    valuationCosts: "", // New field
    bankProcessingFees: "", // New field
    recurringFitOutCosts: "", // New field
    ltvRatio: "", // New field
    repaymentType: "P+I", // New field
    refinancingAssumptions: "", // New field
    foreignExchangeRate: "", // New field
    inflationRate: "", // New field
    escalationClauses: "", // New field
    leaseLength: "", // New field
    shortTermMetrics: "", // New field
    additionalIncomeStreams: "", // New field
    badDebtAllowance: "", // New field
    licensingFees: "", // New field
    camRecoveries: "", // New field
    turnoverRentClauses: "", // New field
    leaseType: "", // New field
    rentFreePeriods: "", // New field
    incentives: "", // New field
    cpiMarketReviewClauses: "", // New field
    holdingPeriod: "", // New field
    expectedSalePrice: "", // New field
    sellingCosts: "", // New field
    currencyConverter: "", // New field
    localTaxRates: "", // New field
    sensitivityTestingInputs: "", // New field
    portfolioAnalysis: "", // New field
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
          <div className="form-group">
            <label>Property Type</label>
            <input
              type="text"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Size (sq ft or sq m)</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Number of Units</label>
            <input
              type="number"
              name="numberOfUnits"
              value={formData.numberOfUnits}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Age/Condition</label>
            <input
              type="text"
              name="ageCondition"
              value={formData.ageCondition}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Occupancy Status</label>
            <input
              type="text"
              name="occupancyStatus"
              value={formData.occupancyStatus}
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
          <div className="form-group">
            <label>Foreign Buyer Surcharge ($)</label>
            <input
              type="number"
              name="foreignBuyerSurcharge"
              value={formData.foreignBuyerSurcharge}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Valuation/Survey Costs ($)</label>
            <input
              type="number"
              name="valuationCosts"
              value={formData.valuationCosts}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bank/Mortgage Processing Fees ($)</label>
            <input
              type="number"
              name="bankProcessingFees"
              value={formData.bankProcessingFees}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Recurring Fit-Out Costs ($)</label>
            <input
              type="number"
              name="recurringFitOutCosts"
              value={formData.recurringFitOutCosts}
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
          <div className="form-group">
            <label>Loan-to-Value (LTV) Ratio (%)</label>
            <input
              type="number"
              name="ltvRatio"
              value={formData.ltvRatio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Repayment Type</label>
            <select
              name="repaymentType"
              value={formData.repaymentType}
              onChange={handleChange}
            >
              <option value="P+I">Principal + Interest</option>
              <option value="InterestOnly">Interest Only</option>
            </select>
          </div>
          <div className="form-group">
            <label>Refinancing Assumptions</label>
            <input
              type="text"
              name="refinancingAssumptions"
              value={formData.refinancingAssumptions}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Foreign Exchange Rate</label>
            <input
              type="text"
              name="foreignExchangeRate"
              value={formData.foreignExchangeRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Inflation Rate (%)</label>
            <input
              type="number"
              name="inflationRate"
              value={formData.inflationRate}
              onChange={handleChange}
            />
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
          <div className="form-group">
            <label>Bad Debt Allowance ($)</label>
            <input
              type="number"
              name="badDebtAllowance"
              value={formData.badDebtAllowance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Licensing Fees ($)</label>
            <input
              type="number"
              name="licensingFees"
              value={formData.licensingFees}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Common Area Maintenance (CAM) Recoveries ($)</label>
            <input
              type="number"
              name="camRecoveries"
              value={formData.camRecoveries}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Turnover Rent Clauses (%)</label>
            <input
              type="number"
              name="turnoverRentClauses"
              value={formData.turnoverRentClauses}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Commercial Lease Variables Section */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Commercial Lease Variables"
          description="Enter the details of the commercial lease."
        />
        <div className="input-grid">
          <div className="form-group">
            <label>Lease Type</label>
            <input
              type="text"
              name="leaseType"
              value={formData.leaseType}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Rent-Free Periods (months)</label>
            <input
              type="number"
              name="rentFreePeriods"
              value={formData.rentFreePeriods}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Incentives</label>
            <input
              type="text"
              name="incentives"
              value={formData.incentives}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>CPI/Market Review Clauses</label>
            <input
              type="text"
              name="cpiMarketReviewClauses"
              value={formData.cpiMarketReviewClauses}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Sale/Exit Assumptions Section */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Sale/Exit Assumptions"
          description="Enter the assumptions for sale or exit."
        />
        <div className="input-grid">
          <div className="form-group">
            <label>Holding Period (years)</label>
            <input
              type="number"
              name="holdingPeriod"
              value={formData.holdingPeriod}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Expected Sale Price ($)</label>
            <input
              type="number"
              name="expectedSalePrice"
              value={formData.expectedSalePrice}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Selling Costs ($)</label>
            <input
              type="number"
              name="sellingCosts"
              value={formData.sellingCosts}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Advanced Features Section */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Advanced Features"
          description="Enter advanced features for the property."
        />
        <div className="input-grid">
          <div className="form-group">
            <label>Currency Converter</label>
            <input
              type="text"
              name="currencyConverter"
              value={formData.currencyConverter}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Local Tax Rates</label>
            <input
              type="text"
              name="localTaxRates"
              value={formData.localTaxRates}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Sensitivity Testing Inputs</label>
            <input
              type="text"
              name="sensitivityTestingInputs"
              value={formData.sensitivityTestingInputs}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Portfolio Analysis</label>
            <input
              type="text"
              name="portfolioAnalysis"
              value={formData.portfolioAnalysis}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Calculate Rental Yield
      </button>
    </form>
  );
};

export default RentalYieldForm;
