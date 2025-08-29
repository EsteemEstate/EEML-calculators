// src/investment-calculators/ReturnOnRenovation/ReturnOnRenovationForm.jsx
import React, { useState } from "react";
import { calculateRenovationROI } from "../../Utils/ReturnOnRenovationFormulas";
import "../../styles/ReturnOnRenovationCalculator.css";

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

function ReturnOnRenovationForm({ setResults }) {
  const [inputs, setInputs] = useState({
    // Property baseline
    propertyName: "Oak Street Duplex",
    currentValue: 350000,
    currentRent: 2500,
    capRate: 6,

    // Financing
    loanBalance: 200000,
    mortgageRate: 4.5,
    loanTermYears: 25,

    // Renovation assumptions
    renovationCosts: 50000,
    contingencyPercent: 10,
    timelineMonths: 6,
    renoEvents: [
      { label: "Kitchen Remodel", cost: 20000, uplift: 8 },
      { label: "Bathroom Upgrade", cost: 10000, uplift: 4 },
    ],

    // Value impact
    appraisalUpliftPercent: 12,
    rentIncreasePercent: 15,
    expenseReductionPercent: 5,

    // Exit assumptions
    holdPeriodYears: 5,
    sellingCostsPercent: 6,
    taxRate: 15,
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
      const results = calculateRenovationROI(inputs);
      setResults(results);
    } catch (error) {
      console.error("Calculation error:", error);
      alert("Error in calculation. Please check your inputs.");
    }
  };

  // --- Reno events ---
  const addRenoEvent = () => {
    setInputs((prev) => ({
      ...prev,
      renoEvents: [...prev.renoEvents, { label: "", cost: 0, uplift: 0 }],
    }));
  };

  const updateRenoEvent = (index, field, value) => {
    const updated = inputs.renoEvents.map((event, i) =>
      i === index
        ? {
            ...event,
            [field]: field === "label" ? value : parseFloat(value) || 0,
          }
        : event
    );
    setInputs((prev) => ({ ...prev, renoEvents: updated }));
  };

  const removeRenoEvent = (index) => {
    setInputs((prev) => ({
      ...prev,
      renoEvents: prev.renoEvents.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="reno-form">
      {/* Property Baseline */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Property Baseline"
          description="Enter property details including value, rent, and cap rate benchmarks"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Property Name (Optional)</label>
            <input
              type="text"
              name="propertyName"
              value={inputs.propertyName}
              onChange={handleChange}
              placeholder="e.g. Oak Street Duplex"
            />
          </div>

          <div className="form-group">
            <label>Current Property Value ($)</label>
            <input
              type="number"
              name="currentValue"
              value={inputs.currentValue}
              onChange={handleChange}
              placeholder="350000"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Current Monthly Rent ($)</label>
            <input
              type="number"
              name="currentRent"
              value={inputs.currentRent}
              onChange={handleChange}
              placeholder="2500"
              min="0"
            />
          </div>

          <div className="form-group">
            <div className="label-container">
              <label>Market Cap Rate (%)</label>
              <HelpIcon tooltip="The capitalization rate for similar properties in your market area" />
            </div>
            <input
              type="number"
              step="0.1"
              name="capRate"
              value={inputs.capRate}
              onChange={handleChange}
              placeholder="6"
              min="0"
              max="20"
            />
          </div>
        </div>
      </div>

      {/* Financing */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Financing & Loan Structure"
          description="Enter loan balance and financing details (optional, but helps IRR/DSCR analysis)"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Current Loan Balance ($)</label>
            <input
              type="number"
              name="loanBalance"
              value={inputs.loanBalance}
              onChange={handleChange}
              placeholder="200000"
              min="0"
            />
          </div>

          <div className="form-group">
            <div className="label-container">
              <label>Mortgage Rate (%)</label>
              <HelpIcon tooltip="The annual interest rate on your current mortgage" />
            </div>
            <input
              type="number"
              step="0.01"
              name="mortgageRate"
              value={inputs.mortgageRate}
              onChange={handleChange}
              placeholder="4.5"
              min="0"
              max="50"
            />
          </div>

          <div className="form-group">
            <label>Loan Term (Years)</label>
            <input
              type="number"
              name="loanTermYears"
              value={inputs.loanTermYears}
              onChange={handleChange}
              placeholder="25"
              min="0"
              max="40"
            />
          </div>
        </div>
      </div>

      {/* Renovation Costs */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Renovation Costs"
          description="Enter total renovation budget, contingency, and timeline OR list detailed items"
        />
        <div className="form-row">
          <div className="form-group">
            <div className="label-container">
              <label>Total Renovation Cost ($)</label>
              <HelpIcon tooltip="Overall estimated renovation budget. This field is disabled if you add itemized renovations below" />
            </div>
            <input
              type="number"
              name="renovationCosts"
              value={inputs.renovationCosts}
              onChange={handleChange}
              placeholder="50000"
              min="0"
              disabled={inputs.renoEvents.length > 0}
            />
          </div>

          <div className="form-group">
            <label>Contingency (%)</label>
            <input
              type="number"
              step="0.1"
              name="contingencyPercent"
              value={inputs.contingencyPercent}
              onChange={handleChange}
              placeholder="10"
              min="0"
              max="50"
            />
            <div className="field-help">
              Buffer for unexpected expenses (usually 5-15%)
            </div>
          </div>

          <div className="form-group">
            <label>Timeline (Months)</label>
            <input
              type="number"
              name="timelineMonths"
              value={inputs.timelineMonths}
              onChange={handleChange}
              placeholder="6"
              min="1"
              max="60"
            />
          </div>
        </div>

        {/* Reno events */}
        <div className="reno-events-section">
          <div className="section-subtitle">
            <span>OR Add Individual Renovation Items:</span>
            <HelpIcon tooltip="Itemize specific renovation projects with their costs and expected value increases" />
          </div>

          {inputs.renoEvents.map((event, index) => (
            <div key={index} className="reno-event">
              <div className="form-group">
                <label>Project Title: (e.g "Kitchen Remodel")</label>
                <input
                  type="text"
                  placeholder="Kitchen Remodel"
                  value={event.label}
                  onChange={(e) =>
                    updateRenoEvent(index, "label", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Cost ($)</label>
                <input
                  type="number"
                  placeholder="Cost"
                  value={event.cost}
                  onChange={(e) =>
                    updateRenoEvent(index, "cost", e.target.value)
                  }
                  min="0"
                />
              </div>

              <div className="form-group">
                <div className="label-container">
                  <label>Value Uplift (%)</label>
                  <HelpIcon tooltip="Expected percentage increase in property value from this renovation" />
                </div>
                <input
                  type="number"
                  placeholder="Uplift %"
                  value={event.uplift}
                  onChange={(e) =>
                    updateRenoEvent(index, "uplift", e.target.value)
                  }
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <button
                type="button"
                onClick={() => removeRenoEvent(index)}
                className="remove-btn remove-reno-btn"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addRenoEvent}
            className="add-btn add-reno-btn"
          >
            + Add Renovation Item
          </button>
        </div>
      </div>

      {/* Value Impact */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Value & Income Impact"
          description="Expected increases in property value, rent, or expense savings"
        />
        <div className="form-row">
          <div className="form-group">
            <div className="label-container">
              <label>Expected Value Increase (%)</label>
              <HelpIcon tooltip="The overall percentage increase in property value you expect after renovations" />
            </div>
            <input
              type="number"
              step="0.1"
              name="appraisalUpliftPercent"
              value={inputs.appraisalUpliftPercent}
              onChange={handleChange}
              placeholder="12"
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <div className="label-container">
              <label>Expected Rent Increase (%)</label>
              <HelpIcon tooltip="The percentage increase in monthly rental income you expect after renovations" />
            </div>
            <input
              type="number"
              step="0.1"
              name="rentIncreasePercent"
              value={inputs.rentIncreasePercent}
              onChange={handleChange}
              placeholder="15"
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <div className="label-container">
              <label>Operating Expense Reduction (%)</label>
              <HelpIcon tooltip="The percentage reduction in operating expenses you expect after renovations" />
            </div>
            <input
              type="number"
              step="0.1"
              name="expenseReductionPercent"
              value={inputs.expenseReductionPercent}
              onChange={handleChange}
              placeholder="5"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Exit Assumptions */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Exit Assumptions"
          description="Holding period, selling costs, and tax assumptions"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Holding Period (Years)</label>
            <input
              type="number"
              name="holdPeriodYears"
              value={inputs.holdPeriodYears}
              onChange={handleChange}
              placeholder="5"
              min="1"
              max="30"
            />
          </div>

          <div className="form-group">
            <div className="label-container">
              <label>Selling Costs (%)</label>
              <HelpIcon tooltip="The percentage of sale price that will go toward commissions and closing costs" />
            </div>
            <input
              type="number"
              step="0.1"
              name="sellingCostsPercent"
              value={inputs.sellingCostsPercent}
              onChange={handleChange}
              placeholder="6"
              min="0"
              max="20"
            />
          </div>

          <div className="form-group">
            <div className="label-container">
              <label>Capital Gains Tax (%)</label>
              <HelpIcon tooltip="The tax rate you expect to pay on capital gains when you sell the property" />
            </div>
            <input
              type="number"
              step="0.1"
              name="taxRate"
              value={inputs.taxRate}
              onChange={handleChange}
              placeholder="15"
              min="0"
              max="50"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="form-section">
        <button type="submit" className="submit-button">
          Calculate ROI
        </button>
      </div>
    </form>
  );
}

export default ReturnOnRenovationForm;
