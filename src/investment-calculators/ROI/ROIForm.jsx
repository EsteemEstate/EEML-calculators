import React, { useState } from "react";
import { calculateROI } from "../../utils/formulas";

function ROIForm({ setResults }) {
  const [inputs, setInputs] = useState({
    // Purchase Info
    price: 300000,
    closingCosts: 9000,
    downPayment: 60000,
    interestRate: 4,
    loanTerm: 30,

    // Income
    rent: 2000,
    otherIncome: 50,

    // Operating Expenses
    taxes: 3600,
    insurance: 1200,
    maintenance: 1800,
    propertyManagement: 1800,
    utilities: 1200,
    hoaFees: 600,
    vacancyRate: 5,

    // Appreciation & Exit
    appreciationRate: 3,
    rentIncreaseRate: 2,
    futureValue: 400000,

    // Holding Period
    holdingPeriod: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value === "" ? "" : parseFloat(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loanAmount = Math.max(
      0,
      (inputs.price || 0) - (inputs.downPayment || 0)
    );

    const roiData = {
      ...inputs,
      loanAmount,
      price: inputs.price || 0,
      rent: inputs.rent || 0,
      otherIncome: inputs.otherIncome || 0,
      taxes: inputs.taxes || 0,
      insurance: inputs.insurance || 0,
      maintenance: inputs.maintenance || 0,
      propertyManagement: inputs.propertyManagement || 0,
      utilities: inputs.utilities || 0,
      hoaFees: inputs.hoaFees || 0,
      vacancyRate: inputs.vacancyRate || 0,
      appreciationRate: inputs.appreciationRate || 0,
      rentIncreaseRate: inputs.rentIncreaseRate || 0,
      holdingPeriod: inputs.holdingPeriod || 5,
      downPayment: inputs.downPayment || 0,
      closingCosts: inputs.closingCosts || 0,
      interestRate: inputs.interestRate || 0,
      loanTerm: inputs.loanTerm || 30,
    };

    setResults({ ...calculateROI(roiData), ...roiData });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Purchase Information Section */}
      <div className="form-section">
        <h2>Purchase Info</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Price ($)</label>
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
            <label>Down Payment ($)</label>
            <input
              name="downPayment"
              type="number"
              value={inputs.downPayment}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              name="interestRate"
              type="number"
              step="0.01"
              value={inputs.interestRate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Loan Term (Years)</label>
            <input
              name="loanTerm"
              type="number"
              value={inputs.loanTerm}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Income Section */}
      <div className="form-section">
        <h2>Income</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Monthly Rent ($)</label>
            <input
              name="rent"
              type="number"
              value={inputs.rent}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Other Income ($)</label>
            <input
              name="otherIncome"
              type="number"
              value={inputs.otherIncome}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Operating Expenses Section */}
      <div className="form-section">
        <h2>Operating Expenses</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Taxes ($)</label>
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
            <label>Maintenance ($)</label>
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
            <label>Property Mgmt ($)</label>
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
            <label>HOA Fees ($)</label>
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
            <label>Vacancy Rate (%)</label>
            <input
              name="vacancyRate"
              type="number"
              step="0.1"
              value={inputs.vacancyRate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Appreciation & Exit Section */}
      <div className="form-section">
        <h2>Appreciation & Exit</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Appreciation Rate (%)</label>
            <input
              name="appreciationRate"
              type="number"
              step="0.1"
              value={inputs.appreciationRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Rent Increase (%)</label>
            <input
              name="rentIncreaseRate"
              type="number"
              step="0.1"
              value={inputs.rentIncreaseRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Future Value ($)</label>
            <input
              name="futureValue"
              type="number"
              value={inputs.futureValue}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Holding Period Section */}
      <div className="form-section">
        <h2>Holding Period</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Years</label>
            <input
              name="holdingPeriod"
              type="number"
              value={inputs.holdingPeriod}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button">
        Calculate ROI
      </button>
    </form>
  );
}

export default ROIForm;
