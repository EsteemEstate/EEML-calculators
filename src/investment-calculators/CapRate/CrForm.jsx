import React, { useState } from "react";
import { calculateCapRate } from "../../Utils/CrFormulas"; // ✅ You'll need to implement this
const SectionTitleWithTooltip = ({ title, description }) => {
  return (
    <div className="section-title-container">
      <h2 className="section-title">{title}</h2>
      <div className="tooltip">
        <span className="tooltip-text">{description}</span>
      </div>
    </div>
  );
};

function CapRateForm({ setResults }) {
  const [inputs, setInputs] = useState({
    // Property & Acquisition Data
    price: "",
    closingCosts: "",
    renovations: "",
    marketLocation: "",
    propertyType: "",
    acquisitionDate: "",

    // Income Inputs
    rent: "",
    vacancyRate: "",
    parkingIncome: "",
    storageIncome: "",
    laundryIncome: "",
    advertisingIncome: "",
    serviceFeesIncome: "",
    eventRentalsIncome: "",
    rentGrowthRate: "",

    // Operating Expenses
    taxes: "",
    insurance: "",
    maintenance: "",
    propertyManagement: "",
    utilities: "",
    hoaFees: "",
    otherExpenses: "",
    expenseGrowthRate: "",

    // Financing & Scenario Variables
    interestRate: "",
    loanTerm: "",
    loanAmount: "",
    holdingPeriod: "",
    exitValue: "",
    exitCapRate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value === "" ? "" : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const incomeTotal =
      (parseFloat(inputs.rent) || 0) * 12 +
      (parseFloat(inputs.parkingIncome) || 0) +
      (parseFloat(inputs.storageIncome) || 0) +
      (parseFloat(inputs.laundryIncome) || 0) +
      (parseFloat(inputs.advertisingIncome) || 0) +
      (parseFloat(inputs.serviceFeesIncome) || 0) +
      (parseFloat(inputs.eventRentalsIncome) || 0);

    const vacancyLoss =
      incomeTotal * ((parseFloat(inputs.vacancyRate) || 0) / 100);

    const operatingExpenses =
      (parseFloat(inputs.taxes) || 0) +
      (parseFloat(inputs.insurance) || 0) +
      (parseFloat(inputs.maintenance) || 0) +
      (parseFloat(inputs.propertyManagement) || 0) +
      (parseFloat(inputs.utilities) || 0) +
      (parseFloat(inputs.hoaFees) || 0) +
      (parseFloat(inputs.otherExpenses) || 0);

    const NOI = incomeTotal - vacancyLoss - operatingExpenses;

    const capRateData = {
      ...inputs,
      incomeTotal,
      vacancyLoss,
      operatingExpenses,
      NOI,
      goingInCapRate: (NOI / (parseFloat(inputs.price) || 1)) * 100,
    };

    setResults({ ...calculateCapRate(capRateData), ...capRateData });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Property & Acquisition Data */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Property & Acquisition Data"
          description="Property details and purchase information"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Purchase Price ($)</label>
            <input
              name="price"
              type="number"
              value={inputs.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Closing Costs ($)</label>
            <input
              name="closingCosts"
              type="number"
              value={inputs.closingCosts}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Renovations / CapEx ($)</label>
            <input
              name="renovations"
              type="number"
              value={inputs.renovations}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Market Location</label>
            <input
              name="marketLocation"
              type="text"
              value={inputs.marketLocation}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Property Type</label>
            <input
              name="propertyType"
              type="text"
              value={inputs.propertyType}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Acquisition Date</label>
            <input
              name="acquisitionDate"
              type="date"
              value={inputs.acquisitionDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Income Inputs */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Income Inputs"
          description="Monthly rental income and other income sources"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Monthly Rent ($)</label>
            <input
              name="rent"
              type="number"
              value={inputs.rent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Vacancy Rate (%)</label>
            <input
              name="vacancyRate"
              type="number"
              step="0.1"
              value={inputs.vacancyRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Parking Income ($/year)</label>
            <input
              name="parkingIncome"
              type="number"
              value={inputs.parkingIncome}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Storage Income ($/year)</label>
            <input
              name="storageIncome"
              type="number"
              value={inputs.storageIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Laundry Income ($/year)</label>
            <input
              name="laundryIncome"
              type="number"
              value={inputs.laundryIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Advertising Income ($/year)</label>
            <input
              name="advertisingIncome"
              type="number"
              value={inputs.advertisingIncome}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Service Fees ($/year)</label>
            <input
              name="serviceFeesIncome"
              type="number"
              value={inputs.serviceFeesIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Event Rentals ($/year)</label>
            <input
              name="eventRentalsIncome"
              type="number"
              value={inputs.eventRentalsIncome}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Projected Rent Growth (%)</label>
            <input
              name="rentGrowthRate"
              type="number"
              step="0.1"
              value={inputs.rentGrowthRate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Operating Expenses */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Operating Expenses"
          description="Annual property expenses"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Property Taxes ($)</label>
            <input
              name="taxes"
              type="number"
              value={inputs.taxes}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Insurance ($)</label>
            <input
              name="insurance"
              type="number"
              value={inputs.insurance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Maintenance & Repairs ($)</label>
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
            <label>Property Management ($)</label>
            <input
              name="propertyManagement"
              type="number"
              value={inputs.propertyManagement}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Utilities ($)</label>
            <input
              name="utilities"
              type="number"
              value={inputs.utilities}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>HOA / Condo Fees ($)</label>
            <input
              name="hoaFees"
              type="number"
              value={inputs.hoaFees}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Other Operating Expenses ($)</label>
            <input
              name="otherExpenses"
              type="number"
              value={inputs.otherExpenses}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Expense Growth Rate (%)</label>
            <input
              name="expenseGrowthRate"
              type="number"
              step="0.1"
              value={inputs.expenseGrowthRate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Financing & Scenario Variables */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Financing & Scenario Variables"
          description="Loan details and exit assumptions"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              name="interestRate"
              type="number"
              step="0.01"
              value={inputs.interestRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Loan Term (Years)</label>
            <input
              name="loanTerm"
              type="number"
              value={inputs.loanTerm}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Loan Amount ($)</label>
            <input
              name="loanAmount"
              type="number"
              value={inputs.loanAmount}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Holding Period (Years)</label>
            <input
              name="holdingPeriod"
              type="number"
              value={inputs.holdingPeriod}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Projected Sale Price ($)</label>
            <input
              name="exitValue"
              type="number"
              value={inputs.exitValue}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Exit Cap Rate (%)</label>
            <input
              name="exitCapRate"
              type="number"
              step="0.1"
              value={inputs.exitCapRate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button">
        Calculate Cap Rate
      </button>
    </form>
  );
}

export default CapRateForm;
