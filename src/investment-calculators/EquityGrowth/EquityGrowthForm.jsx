// src/investment-calculators/EquityGrowth/EquityGrowthForm.jsx
import React, { useState } from "react";
import { calculateEquityGrowth } from "../../Utils/EquityGrowthFormulas";
import "../../styles/EquityGrowthCalculator.css";

const SectionTitleWithTooltip = ({ title, description }) => (
  <div className="section-title-container">
    <h2 className="section-title">{title}</h2>
    <div className="tooltip">
      <span className="tooltip-text">{description}</span>
    </div>
  </div>
);

function EquityGrowthForm({ setResults }) {
  const [inputs, setInputs] = useState({
    // Global / Scenario
    scenarioLabel: "",
    currency: "",
    locale: "en-US",
    startDate: "",
    projectionHorizonYears: "",
    compounding: "",
    inflation: "",
    discountRate: "",
    monteCarloEnabled: false,
    monteCarloRuns: "",
    monteCarloSeed: "",
    monteCarloVolatility: "",
    monteCarloMean: "",

    // Property & Market
    homePrice: "",
    downPayment: "",
    appreciation: "",
    renoEvents: [],

    // Financing
    mortgagePrincipal: "",
    mortgageRate: "",
    mortgageTermMonths: "",
    amortizationType: "",
    points: "",
    closingCosts: "",
    extraPrincipalSchedule: [],
    pmiEnabled: false,
    pmiPercent: "",
    pmiStopLTV: "",
    refinanceEvents: [],
    secondaryLien: [],

    // Carrying costs
    propertyTax: "",
    insurance: "",
    hoaFee: "",
    maintenancePercent: "",
    vacancyAllowance: "",

    // Sale / Exit
    targetSaleDate: "",
    sellingCostsPercent: "",
    capitalGainsRate: "",
    depreciationRecapture: "",

    // UX / Output options
    granularity: "",
    showMCPercentiles: false,
    nominalVsReal: "",
    exportCSV: false,
    exportPDF: false,
    shareLink: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value === ""
          ? ""
          : parseFloat(value) || value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = calculateEquityGrowth(inputs);
    setResults(results);
  };

  // Helper to manage array-type inputs
  const addArrayItem = (field, defaultValue = {}) => {
    setInputs((prev) => ({ ...prev, [field]: [...prev[field], defaultValue] }));
  };

  const updateArrayItem = (field, index, key, value) => {
    const arr = [...inputs[field]];
    arr[index][key] = value;
    setInputs((prev) => ({ ...prev, [field]: arr }));
  };

  const removeArrayItem = (field, index) => {
    const arr = [...inputs[field]];
    arr.splice(index, 1);
    setInputs((prev) => ({ ...prev, [field]: arr }));
  };

  return (
    <form onSubmit={handleSubmit} className="equity-growth-form">
      {/* 1. Global / Scenario */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Global / Scenario"
          description="Currency, scenario label, projection horizon, inflation, Monte Carlo"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Scenario Label</label>
            <input
              name="scenarioLabel"
              value={inputs.scenarioLabel}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Currency</label>
            <input
              name="currency"
              value={inputs.currency}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Projection Horizon (years)</label>
            <input
              name="projectionHorizonYears"
              type="number"
              value={inputs.projectionHorizonYears}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Inflation (%)</label>
            <input
              name="inflation"
              type="number"
              step="0.001"
              value={inputs.inflation}
              onChange={handleChange}
            />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="monteCarloEnabled"
                checked={inputs.monteCarloEnabled}
                onChange={handleChange}
              />
              Enable Monte Carlo
            </label>
          </div>
        </div>
      </div>
      {/* 2. Property & Market */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Property & Market"
          description="Purchase price, down payment, appreciation, renovations"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Home Price</label>
            <input
              name="homePrice"
              type="number"
              value={inputs.homePrice}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Down Payment</label>
            <input
              name="downPayment"
              type="number"
              value={inputs.downPayment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Annual Appreciation (%)</label>
            <input
              name="appreciation"
              type="number"
              step="0.001"
              value={inputs.appreciation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Renovation/CapEx Events */}
        <div className="form-row">
          <h4>Renovations / CapEx</h4>
          {inputs.renoEvents.map((event, idx) => (
            <div className="array-item" key={idx}>
              <input
                type="date"
                value={event.date || ""}
                onChange={(e) =>
                  updateArrayItem("renoEvents", idx, "date", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Cost"
                value={event.cost || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "renoEvents",
                    idx,
                    "cost",
                    parseFloat(e.target.value)
                  )
                }
              />
              <input
                type="number"
                placeholder="Uplift (%)"
                value={event.uplift || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "renoEvents",
                    idx,
                    "uplift",
                    parseFloat(e.target.value)
                  )
                }
              />
              <button
                type="button"
                className="remove-item-btn"
                onClick={() => removeArrayItem("renoEvents", idx)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-item-btn"
            onClick={() =>
              addArrayItem("renoEvents", { date: "", cost: 0, uplift: 0 })
            }
          >
            Add Renovation
          </button>
        </div>
      </div>

      <div className="form-section">
        <SectionTitleWithTooltip
          title="Financing"
          description="Primary mortgage, extra principal, PMI, refinance events"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Mortgage Principal</label>
            <input
              name="mortgagePrincipal"
              type="number"
              value={inputs.mortgagePrincipal}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Mortgage Rate (%)</label>
            <input
              name="mortgageRate"
              type="number"
              step="0.001"
              value={inputs.mortgageRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Mortgage Term (months)</label>
            <input
              name="mortgageTermMonths"
              type="number"
              value={inputs.mortgageTermMonths}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Amortization Type</label>
            <select
              name="amortizationType"
              value={inputs.amortizationType}
              onChange={handleChange}
            >
              <option value="standard">Standard</option>
              <option value="interest-only">Interest Only</option>
              <option value="balloon">Balloon</option>
            </select>
          </div>
        </div>

        {/* Extra Principal Schedule */}
        <div className="form-row">
          <h4>Extra Principal Payments</h4>
          {inputs.extraPrincipalSchedule.map((item, idx) => (
            <div className="array-item" key={idx}>
              <input
                type="date"
                value={item.date || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "extraPrincipalSchedule",
                    idx,
                    "date",
                    e.target.value
                  )
                }
              />
              <input
                type="number"
                placeholder="Amount"
                value={item.amount || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "extraPrincipalSchedule",
                    idx,
                    "amount",
                    parseFloat(e.target.value)
                  )
                }
              />
              <button
                type="button"
                className="remove-item-btn"
                onClick={() => removeArrayItem("extraPrincipalSchedule", idx)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-item-btn"
            onClick={() =>
              addArrayItem("extraPrincipalSchedule", { date: "", amount: 0 })
            }
          >
            Add Extra Payment
          </button>
        </div>

        {/* PMI */}
        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="pmiEnabled"
                checked={inputs.pmiEnabled}
                onChange={handleChange}
              />
              Enable PMI
            </label>
          </div>
          {inputs.pmiEnabled && (
            <>
              <div className="form-group">
                <label>PMI (%)</label>
                <input
                  type="number"
                  step="0.001"
                  name="pmiPercent"
                  value={inputs.pmiPercent}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>PMI Stop LTV (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="pmiStopLTV"
                  value={inputs.pmiStopLTV}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>

        {/* Refinance Events */}
        <div className="form-row">
          <h4>Refinance Events</h4>
          {inputs.refinanceEvents.map((item, idx) => (
            <div className="array-item" key={idx}>
              <input
                type="date"
                value={item.date || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "refinanceEvents",
                    idx,
                    "date",
                    e.target.value
                  )
                }
              />
              <input
                type="number"
                placeholder="New Rate (%)"
                value={item.newRate || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "refinanceEvents",
                    idx,
                    "newRate",
                    parseFloat(e.target.value)
                  )
                }
              />
              <input
                type="number"
                placeholder="New Term (months)"
                value={item.newTerm || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "refinanceEvents",
                    idx,
                    "newTerm",
                    parseFloat(e.target.value)
                  )
                }
              />
              <button
                type="button"
                className="remove-item-btn"
                onClick={() => removeArrayItem("refinanceEvents", idx)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-item-btn"
            onClick={() =>
              addArrayItem("refinanceEvents", {
                date: "",
                newRate: 0,
                newTerm: 0,
              })
            }
          >
            Add Refinance
          </button>
        </div>
      </div>
      {/* 4. Carrying Costs & Operating Assumptions */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Carrying Costs & Operating Assumptions"
          description="Taxes, insurance, HOA, maintenance, vacancy"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Property Tax (% of value/year)</label>
            <input
              type="number"
              step="0.001"
              name="propertyTax"
              value={inputs.propertyTax}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Home Insurance (annual)</label>
            <input
              type="number"
              name="insurance"
              value={inputs.insurance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>HOA Fee (monthly)</label>
            <input
              type="number"
              name="hoaFee"
              value={inputs.hoaFee}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Maintenance (% of value/year)</label>
            <input
              type="number"
              step="0.001"
              name="maintenancePercent"
              value={inputs.maintenancePercent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Vacancy Allowance (%)</label>
            <input
              type="number"
              step="0.001"
              name="vacancyAllowance"
              value={inputs.vacancyAllowance}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      {/* 5. Sale / Exit Assumptions */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Sale / Exit Assumptions"
          description="Target sale date, selling costs, capital gains, depreciation recapture"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Target Sale Date</label>
            <input
              type="date"
              name="targetSaleDate"
              value={inputs.targetSaleDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Selling Costs (%)</label>
            <input
              type="number"
              step="0.001"
              name="sellingCostsPercent"
              value={inputs.sellingCostsPercent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Capital Gains Rate (%)</label>
            <input
              type="number"
              step="0.001"
              name="capitalGainsRate"
              value={inputs.capitalGainsRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Depreciation Recapture (%)</label>
            <input
              type="number"
              step="0.001"
              name="depreciationRecapture"
              value={inputs.depreciationRecapture}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 7. Output & UX Controls */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Output & UX Controls"
          description="Set granularity, real vs nominal, Monte Carlo, and export options"
        />
        <div className="form-row">
          {/* Granularity */}
          <div className="form-group">
            <label>Granularity</label>
            <select
              name="granularity"
              value={inputs.granularity}
              onChange={handleChange}
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          {/* Nominal vs Real */}
          <div className="form-group">
            <label>Currency Type</label>
            <select
              name="currencyType"
              value={inputs.currencyType}
              onChange={handleChange}
            >
              <option value="nominal">Nominal</option>
              <option value="real">Real (inflation-adjusted)</option>
            </select>
          </div>

          {/* Monte Carlo Percentiles */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="showMCPercentiles"
                checked={inputs.showMCPercentiles}
                onChange={handleChange}
              />
              Show Monte Carlo Percentiles (P5/P50/P95)
            </label>
          </div>

          {/* Export Options */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="exportCSV"
                checked={inputs.exportCSV}
                onChange={handleChange}
              />
              Export Monthly Table (CSV/XLSX)
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="exportPDF"
                checked={inputs.exportPDF}
                onChange={handleChange}
              />
              Export Summary PDF
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="shareLink"
                checked={inputs.shareLink}
                onChange={handleChange}
              />
              Generate Encoded Link for Sharing
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <button type="submit" className="submit-button">
          Calculate Equity Growth
        </button>
      </div>
    </form>
  );
}

export default EquityGrowthForm;
