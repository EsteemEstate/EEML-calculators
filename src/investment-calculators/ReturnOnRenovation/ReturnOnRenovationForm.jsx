// src/investment-calculators/ReturnOnRenovation/ReturnOnRenovationForm.jsx
import React, { useState } from "react";
import { calculateRenovationROI } from "../../Utils/ReturnOnRenovationFormulas";
import "../../styles/ReturnOnRenovationCalculator.css";

const SectionTitleWithTooltip = ({ title, description }) => (
  <div className="section-title-container">
    <h3 className="section-title">{title}</h3>
    {description && (
      <div className="tooltip">
        ℹ️
        <span className="tooltip-text">{description}</span>
      </div>
    )}
  </div>
);

function ReturnOnRenovationForm({ setResults }) {
  const [inputs, setInputs] = useState({
    // Property baseline
    currentValue: "",
    currentRent: "",
    capRate: "6",

    // Renovation assumptions
    renovationCosts: "",
    renoEvents: [],

    // Value impact
    appraisalUpliftPercent: "",
    rentIncreasePercent: "",

    // Exit assumptions
    holdPeriodYears: "5",
    sellingCostsPercent: "6",
    taxRate: "15",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? ""
          : !isNaN(parseFloat(value))
          ? parseFloat(value)
          : value,
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

  const addRenoEvent = () => {
    setInputs((prev) => ({
      ...prev,
      renoEvents: [...prev.renoEvents, { label: "", cost: 0, uplift: 0 }],
    }));
  };

  const updateRenoEvent = (index, field, value) => {
    const updatedEvents = inputs.renoEvents.map((event, i) =>
      i === index
        ? {
            ...event,
            [field]: field === "label" ? value : parseFloat(value) || 0,
          }
        : event
    );
    setInputs((prev) => ({ ...prev, renoEvents: updatedEvents }));
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
          description="Current property value, rent, and market cap rate"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Current Property Value ($)</label>
            <input
              type="number"
              name="currentValue"
              value={inputs.currentValue}
              onChange={handleChange}
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
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Market Cap Rate (%)</label>
            <input
              type="number"
              step="0.1"
              name="capRate"
              value={inputs.capRate}
              onChange={handleChange}
              min="0"
              max="20"
            />
          </div>
        </div>
      </div>

      {/* Renovation Costs */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Renovation Costs"
          description="Total renovation budget or individual renovation items"
        />
        <div className="form-group">
          <label>Total Renovation Cost ($)</label>
          <input
            type="number"
            name="renovationCosts"
            value={inputs.renovationCosts}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="reno-events-section">
          <label>OR Add Individual Renovation Items:</label>
          {inputs.renoEvents.map((event, index) => (
            <div key={index} className="reno-event">
              <input
                type="text"
                placeholder="Description (e.g., Kitchen remodel)"
                value={event.label}
                onChange={(e) =>
                  updateRenoEvent(index, "label", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Cost ($)"
                value={event.cost}
                onChange={(e) => updateRenoEvent(index, "cost", e.target.value)}
                min="0"
              />
              <input
                type="number"
                placeholder="Value Uplift (%)"
                value={event.uplift}
                onChange={(e) =>
                  updateRenoEvent(index, "uplift", e.target.value)
                }
                min="0"
                max="100"
                step="0.1"
              />
              <button
                type="button"
                onClick={() => removeRenoEvent(index)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addRenoEvent} className="add-btn">
            + Add Renovation Item
          </button>
        </div>
      </div>

      {/* Value Impact */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Value Impact"
          description="Expected increase in property value and rental income"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Expected Value Increase (%)</label>
            <input
              type="number"
              step="0.1"
              name="appraisalUpliftPercent"
              value={inputs.appraisalUpliftPercent}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>Expected Rent Increase (%)</label>
            <input
              type="number"
              step="0.1"
              name="rentIncreasePercent"
              value={inputs.rentIncreasePercent}
              onChange={handleChange}
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
          description="Holding period and selling costs"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Holding Period (Years)</label>
            <input
              type="number"
              name="holdPeriodYears"
              value={inputs.holdPeriodYears}
              onChange={handleChange}
              min="1"
              max="30"
            />
          </div>
          <div className="form-group">
            <label>Selling Costs (%)</label>
            <input
              type="number"
              step="0.1"
              name="sellingCostsPercent"
              value={inputs.sellingCostsPercent}
              onChange={handleChange}
              min="0"
              max="20"
            />
          </div>
          <div className="form-group">
            <label>Capital Gains Tax (%)</label>
            <input
              type="number"
              step="0.1"
              name="taxRate"
              value={inputs.taxRate}
              onChange={handleChange}
              min="0"
              max="50"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <button type="submit" className="submit-button">
          Calculate ROI
        </button>
      </div>
    </form>
  );
}

export default ReturnOnRenovationForm;
