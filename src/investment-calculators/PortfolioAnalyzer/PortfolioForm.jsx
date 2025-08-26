// PortfolioForm.jsx
import React, { useState } from "react";
import "../../styles/PortfolioAnalyzer.css";

const SectionTitleWithTooltip = ({ title, description }) => (
  <div className="section-title-container">
    <h2 className="section-title">{title}</h2>
    <div className="tooltip">
      <span className="tooltip-icon">ℹ️</span>
      <span className="tooltip-text">{description}</span>
    </div>
  </div>
);

function PortfolioForm({ setResults }) {
  const [inputs, setInputs] = useState({
    portfolioName: "Sample Portfolio",
    scenarioLabel: "Scenario A",
    currency: "TTD",
    inflation: 2.0,
    projectionHorizonYears: 10,
    targetWealthGoal: 1000000,
    targetIncomeGoal: 50000,
    granularity: "annual",
    currencyType: "nominal",
    exportCSV: false,
    exportPDF: false,
    shareLink: false,
    showMonteCarlo: false,

    properties: [
      {
        name: "Downtown Condo",
        type: "residential",
        purchasePrice: 500000,
        currentValue: 520000,
        location: "Port of Spain",
        loanAmount: 350000,
        loanBalance: 340000,
        interestRate: 5,
        termMonths: 360,
        amortizationType: "fixed",
        closingCosts: 5000,
        points: 0,
        refinanceOptions: [],
        rent: 3000,
        vacancyRate: 5,
        rentGrowth: 3,
        operatingExpenses: {
          propertyTax: 1.2,
          insurance: 1200,
          hoa: 200,
          utilities: 100,
          maintenance: 1,
          managementFeesPercent: 5,
          other: 50,
        },
        monthlyPI: 2000,
        horizonYears: 10,
        appreciation: 3,
        nightlyRate: 0,
        occupancyRate: 0,
        seasonalVariation: 0,
        annualLeaseAmount: 0,
        escalationClause: 0,
        renovations: [],
        saleAssumptions: {
          exitYear: new Date().getFullYear() + 5,
          sellingCostsPercent: 6,
        },
      },
      {
        name: "Suburban House",
        type: "residential",
        purchasePrice: 400000,
        currentValue: 410000,
        location: "Chaguanas",
        loanAmount: 250000,
        loanBalance: 245000,
        interestRate: 4.5,
        termMonths: 360,
        amortizationType: "fixed",
        closingCosts: 4000,
        points: 0,
        refinanceOptions: [],
        rent: 2500,
        vacancyRate: 5,
        rentGrowth: 2,
        operatingExpenses: {
          propertyTax: 1,
          insurance: 1000,
          hoa: 0,
          utilities: 150,
          maintenance: 1,
          managementFeesPercent: 5,
          other: 50,
        },
        monthlyPI: 1500,
        horizonYears: 10,
        appreciation: 2,
        nightlyRate: 0,
        occupancyRate: 0,
        seasonalVariation: 0,
        annualLeaseAmount: 0,
        escalationClause: 0,
        renovations: [],
        saleAssumptions: {
          exitYear: new Date().getFullYear() + 5,
          sellingCostsPercent: 6,
        },
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (parent, key, value) => {
    setInputs((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value,
      },
    }));
  };

  const addProperty = () => {
    setInputs((prev) => ({
      ...prev,
      properties: [...prev.properties, { ...emptyProperty, id: Date.now() }],
    }));
  };

  const updateProperty = (index, key, value) => {
    const updated = [...inputs.properties];

    // Handle nested objects
    if (key.includes(".")) {
      const keys = key.split(".");
      let obj = updated[index];
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
    } else {
      updated[index][key] = value;
    }

    setInputs((prev) => ({ ...prev, properties: updated }));
  };

  const removeProperty = (index) => {
    const updated = [...inputs.properties];
    updated.splice(index, 1);
    setInputs((prev) => ({ ...prev, properties: updated }));
  };

  const addRenovation = (propertyIndex) => {
    const updated = [...inputs.properties];
    updated[propertyIndex].renovations.push({
      cost: 0,
      valueUpliftPercent: 0,
      year: new Date().getFullYear(),
    });
    setInputs((prev) => ({ ...prev, properties: updated }));
  };

  const updateRenovation = (propertyIndex, renovationIndex, key, value) => {
    const updated = [...inputs.properties];
    updated[propertyIndex].renovations[renovationIndex][key] = value;
    setInputs((prev) => ({ ...prev, properties: updated }));
  };

  const removeRenovation = (propertyIndex, renovationIndex) => {
    const updated = [...inputs.properties];
    updated[propertyIndex].renovations.splice(renovationIndex, 1);
    setInputs((prev) => ({ ...prev, properties: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with real portfolio calculation
    console.log("Form submitted with data:", inputs);
    setResults(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="portfolio-form">
      {/* 1. Portfolio Setup */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Portfolio Setup"
          description="Define your portfolio name, scenario, currency, and financial goals"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Portfolio Name</label>
            <input
              name="portfolioName"
              value={inputs.portfolioName}
              onChange={handleChange}
              placeholder="My Investment Portfolio"
            />
          </div>
          <div className="form-group">
            <label>Scenario Label</label>
            <select
              name="scenarioLabel"
              value={inputs.scenarioLabel}
              onChange={handleChange}
            >
              <option value="Scenario A">Scenario A</option>
              <option value="Scenario B">Scenario B</option>
              <option value="Scenario C">Scenario C</option>
            </select>
          </div>
          <div className="form-group">
            <label>Currency</label>
            <select
              name="currency"
              value={inputs.currency}
              onChange={handleChange}
            >
              <option value="TT$">TT$</option>
              <option value="USD">USD</option>
              <option value="CAD">CAD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Projection Horizon (years)</label>
            <input
              name="projectionHorizonYears"
              type="number"
              min="1"
              max="50"
              value={inputs.projectionHorizonYears}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Inflation (%)</label>
            <input
              name="inflation"
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={inputs.inflation}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Target Wealth Goal ({inputs.currency})</label>
            <input
              name="targetWealthGoal"
              type="number"
              value={inputs.targetWealthGoal}
              onChange={handleChange}
              placeholder="1,000,000"
            />
          </div>
          <div className="form-group">
            <label>Target Monthly Income ({inputs.currency})</label>
            <input
              name="targetIncomeGoal"
              type="number"
              value={inputs.targetIncomeGoal}
              onChange={handleChange}
              placeholder="5,000"
            />
          </div>
        </div>
      </div>

      {/* 2. Properties */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Properties"
          description="Add one or more properties to your portfolio with detailed financial information"
        />

        {inputs.properties.map((prop, idx) => (
          <div key={prop.id || idx} className="property-card">
            <div className="property-header">
              <h4>{prop.name || `Property ${idx + 1}`}</h4>
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeProperty(idx)}
              >
                Remove
              </button>
            </div>

            <div className="property-section">
              <h5>General Information</h5>
              <div className="form-row">
                <div className="form-group">
                  <label>Property Name</label>
                  <input
                    value={prop.name}
                    onChange={(e) =>
                      updateProperty(idx, "name", e.target.value)
                    }
                    placeholder="Beachfront Villa"
                  />
                </div>
                <div className="form-group">
                  <label>Property Type</label>
                  <select
                    value={prop.type}
                    onChange={(e) =>
                      updateProperty(idx, "type", e.target.value)
                    }
                  >
                    <option value="residential">Residential Rental</option>
                    <option value="airbnb">Airbnb/Short-term</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Purchase Price ({inputs.currency})</label>
                  <input
                    type="number"
                    value={prop.purchasePrice}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "purchasePrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Purchase Date</label>
                  <input
                    type="date"
                    value={prop.purchaseDate}
                    onChange={(e) =>
                      updateProperty(idx, "purchaseDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Market Value ({inputs.currency})</label>
                  <input
                    type="number"
                    value={prop.currentMarketValue}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "currentMarketValue",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    value={prop.location}
                    onChange={(e) =>
                      updateProperty(idx, "location", e.target.value)
                    }
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            <div className="property-section">
              <h5>Financing & Debt</h5>
              <div className="form-row">
                <div className="form-group">
                  <label>Loan Amount ({inputs.currency})</label>
                  <input
                    type="number"
                    value={prop.loanAmount}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "loanAmount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prop.interestRate}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "interestRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Loan Term (months)</label>
                  <input
                    type="number"
                    value={prop.termMonths}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "termMonths",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Amortization Type</label>
                  <select
                    value={prop.amortizationType}
                    onChange={(e) =>
                      updateProperty(idx, "amortizationType", e.target.value)
                    }
                  >
                    <option value="fixed">Fixed</option>
                    <option value="interestOnly">Interest Only</option>
                    <option value="balloon">Balloon Payment</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Closing Costs ({inputs.currency})</label>
                  <input
                    type="number"
                    value={prop.closingCosts}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "closingCosts",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Points</label>
                  <input
                    type="number"
                    step="0.125"
                    value={prop.points}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "points",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="property-section">
              <h5>Income & Cashflow</h5>
              {prop.type === "residential" && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Monthly Rent ({inputs.currency})</label>
                      <input
                        type="number"
                        value={prop.rent}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "rent",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Vacancy Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={prop.vacancyRate}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "vacancyRate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Annual Rent Growth (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={prop.rentGrowth}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "rentGrowth",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {prop.type === "airbnb" && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nightly Rate ({inputs.currency})</label>
                      <input
                        type="number"
                        value={prop.nightlyRate}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "nightlyRate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Occupancy Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={prop.occupancyRate}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "occupancyRate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Seasonal Variation (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={prop.seasonalVariation}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "seasonalVariation",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {prop.type === "commercial" && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Annual Lease Amount ({inputs.currency})</label>
                      <input
                        type="number"
                        value={prop.annualLeaseAmount}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "annualLeaseAmount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Escalation Clause (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={prop.escalationClause}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "escalationClause",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {prop.type === "land" && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Lease Income ({inputs.currency})</label>
                      <input
                        type="number"
                        value={prop.rent}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "rent",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Annual Appreciation (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={prop.rentGrowth}
                        onChange={(e) =>
                          updateProperty(
                            idx,
                            "rentGrowth",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-row">
                <h6>Operating Expenses</h6>
                <div className="form-group">
                  <label>Property Tax (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prop.operatingExpenses.propertyTax}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "operatingExpenses.propertyTax",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Insurance ({inputs.currency})</label>
                  <input
                    type="number"
                    value={prop.operatingExpenses.insurance}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "operatingExpenses.insurance",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>HOA Fees ({inputs.currency})</label>
                  <input
                    type="number"
                    value={prop.operatingExpenses.hoa}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "operatingExpenses.hoa",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Utilities ({inputs.currency})</label>
                  <input
                    type="number"
                    value={prop.operatingExpenses.utilities}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "operatingExpenses.utilities",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Maintenance (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prop.operatingExpenses.maintenance}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "operatingExpenses.maintenance",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Management Fees (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={prop.operatingExpenses.managementFeesPercent}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "operatingExpenses.managementFeesPercent",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Other Expenses ({inputs.currency})</label>
                  <input
                    type="number"
                    value={prop.operatingExpenses.other}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "operatingExpenses.other",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="property-section">
              <h5>Renovations & Capital Expenditures</h5>
              {prop.renovations.map((reno, renoIdx) => (
                <div key={renoIdx} className="renovation-row">
                  <div className="form-group">
                    <label>Cost ({inputs.currency})</label>
                    <input
                      type="number"
                      value={reno.cost}
                      onChange={(e) =>
                        updateRenovation(
                          idx,
                          renoIdx,
                          "cost",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Value Uplift (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={reno.valueUpliftPercent}
                      onChange={(e) =>
                        updateRenovation(
                          idx,
                          renoIdx,
                          "valueUpliftPercent",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      value={reno.year}
                      onChange={(e) =>
                        updateRenovation(
                          idx,
                          renoIdx,
                          "year",
                          parseInt(e.target.value) || new Date().getFullYear()
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="remove-btn small"
                    onClick={() => removeRenovation(idx, renoIdx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-btn"
                onClick={() => addRenovation(idx)}
              >
                Add Renovation
              </button>
            </div>

            <div className="property-section">
              <h5>Sale / Exit Assumptions</h5>
              <div className="form-row">
                <div className="form-group">
                  <label>Target Sale Year</label>
                  <input
                    type="number"
                    value={prop.saleAssumptions.exitYear}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "saleAssumptions.exitYear",
                        parseInt(e.target.value) || new Date().getFullYear()
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Selling Costs (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={prop.saleAssumptions.sellingCostsPercent}
                    onChange={(e) =>
                      updateProperty(
                        idx,
                        "saleAssumptions.sellingCostsPercent",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="add-btn large" onClick={addProperty}>
          + Add Property
        </button>
      </div>

      {/* 3. Output & UX Controls */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Output & UX Controls"
          description="Customize how you want to view and export your portfolio analysis"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Granularity</label>
            <select
              name="granularity"
              value={inputs.granularity}
              onChange={handleChange}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div className="form-group">
            <label>Currency Type</label>
            <select
              name="currencyType"
              value={inputs.currencyType}
              onChange={handleChange}
            >
              <option value="nominal">Nominal</option>
              <option value="real">Real (Inflation-Adjusted)</option>
            </select>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="showMonteCarlo"
                checked={inputs.showMonteCarlo}
                onChange={handleChange}
              />
              Show Monte Carlo Analysis
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="exportCSV"
                checked={inputs.exportCSV}
                onChange={handleChange}
              />
              Export CSV
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
              Export PDF Report
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
              Generate Shareable Link
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <button type="submit" className="submit-button">
          Analyze Portfolio
        </button>
      </div>
    </form>
  );
}

export default PortfolioForm;
