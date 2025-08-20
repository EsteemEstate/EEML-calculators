import React, { useState } from "react";
import { calculateBreakEven } from "../../Utils/BEformulas";
import "../../styles/BreakEvenCalculator.css";

const SectionTitleWithTooltip = ({ title, description }) => (
  <div className="section-title-container">
    <h2 className="section-title">{title}</h2>
    <div className="tooltip">
      <span className="tooltip-text">{description}</span>
    </div>
  </div>
);

// Initial placeholder data object
const initialPlaceholderData = {
  propertyType: "",
  purchasePrice: "",
  marketValue: "",
  address: "",
  region: "",
  currency: "",
  beds: "",
  baths: "",
  sizeSqFt: "",
  hoaAllowed: "",

  downPayment: "",
  closingCosts: "",
  closingCostsBreakdown: { legal: "", inspection: "", other: "" },
  rehabCost: "",
  furnishingsCost: "",
  lenderPoints: "",

  loanAmount: "",
  interestRate: "",
  amortizationYears: "",
  loanTerm: "",
  paymentFrequency: "",
  interestOnlyMonths: "",
  secondLien: "",
  secondLienAmount: "",
  secondLienRate: "",
  mortgageInsurance: "",

  propertyTax: "",
  insurance: "",
  hoaFee: "",
  utilitiesWater: "",
  utilitiesElectric: "",
  utilitiesInternet: "",
  utilitiesGas: "",
  adminCosts: "",

  managementFeePercent: "",
  maintenanceReservePercent: "",
  capexReservePercent: "",
  leasingFeePercent: "",
  vacancyPercent: "",
  badDebtPercent: "",

  monthlyRent: "",
  otherIncome: "",
  nightlyRate: "",
  occupancyRate: "",
  occupiedNights: "",
  seasonalUplift: ["", "", "", "", "", "", "", "", "", "", "", ""],
  cleaningFee: "",
  channelFeePercent: "",
  turnoverCost: "",
  linenCost: "",
  upsells: "",

  effectiveTaxRate: "",
  taxBrackets: [],
  depreciationLife: "",
  interestDeductible: "",

  breakEvenMode: "",
  targetDSCR: "",
  targetMonthlyMargin: "",
  targetPaybackMonths: "",

  presetScenario: "",
  rentAdjustment: "",
  occupancyAdjustment: "",
  rateAdjustment: "",
  vacancyAdjustment: "",

  unitSystem: "",
  dataExport: "",
  permalinkSharing: "",
};

function BreakEvenForm({ setResults }) {
  const [inputs, setInputs] = useState(initialPlaceholderData);

  // Toggles for collapsible advanced sections
  const [showAdvancedClosing, setShowAdvancedClosing] = useState(false);
  const [showSTRFields, setShowSTRFields] = useState(false);
  const [showSecondLien, setShowSecondLien] = useState(false);
  const [showPMI, setShowPMI] = useState(false);
  const [showAdvancedTaxes, setShowAdvancedTaxes] = useState(false);
  const [showScenarioControls, setShowScenarioControls] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (name.startsWith("seasonalUplift-")) {
      const monthIndex = parseInt(name.split("-")[1], 10);
      const newUplift = [...inputs.seasonalUplift];
      newUplift[monthIndex] = parseFloat(value) || 1;
      setInputs({ ...inputs, seasonalUplift: newUplift });
      return;
    }

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

  const handleClosingCostChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      closingCostsBreakdown: {
        ...inputs.closingCostsBreakdown,
        [name]: parseFloat(value) || 0,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalVariablePercent =
      (parseFloat(inputs.vacancyPercent) || 0) +
      (parseFloat(inputs.managementFeePercent) || 0) +
      (parseFloat(inputs.maintenanceReservePercent) || 0);
    if (totalVariablePercent > 100) {
      alert(
        "Warning: Sum of variable costs exceeds 100%. Please adjust inputs."
      );
      return;
    }
    setResults({ ...calculateBreakEven(inputs), ...inputs });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* 1. Property & Market */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Property & Market"
          description="Basic property info and market context"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Property Type</label>
            <select
              name="propertyType"
              value={inputs.propertyType}
              onChange={(e) => {
                handleChange(e);
                setShowSTRFields(e.target.value === "STR");
              }}
            >
              <option value="SFH">SFH</option>
              <option value="Condo">Condo</option>
              <option value="Multi-Family">Multi-Family</option>
              <option value="Commercial">Commercial</option>
              <option value="STR">Short-Term Rental</option>
            </select>
          </div>
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
            <label>Market Value ({inputs.currency})</label>
            <input
              name="marketValue"
              type="number"
              value={inputs.marketValue}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              type="text"
              value={inputs.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Region</label>
            <select name="region" value={inputs.region} onChange={handleChange}>
              <option value="Caribbean">Caribbean</option>
              <option value="USA">USA</option>
            </select>
          </div>
          <div className="form-group">
            <label>Beds</label>
            <input
              name="beds"
              type="number"
              value={inputs.beds}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Baths</label>
            <input
              name="baths"
              type="number"
              value={inputs.baths}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Sq. Ft.</label>
            <input
              name="sizeSqFt"
              type="number"
              value={inputs.sizeSqFt}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <label>
            <input
              type="checkbox"
              name="hoaAllowed"
              checked={inputs.hoaAllowed}
              onChange={handleChange}
            />
            HOA/Strata Allowed?
          </label>
        </div>
      </div>

      {/* 2. Acquisition & Upfront Costs */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Acquisition & Upfront Costs"
          description="Down payment, closing costs, rehab, furnishings"
        />
        <div className="form-row">
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
            <label>Total Closing Costs</label>
            <input
              name="closingCosts"
              type="number"
              value={inputs.closingCosts}
              onChange={handleChange}
            />
            <button
              className="be-btn-spacing"
              type="button"
              onClick={() => setShowAdvancedClosing(!showAdvancedClosing)}
            >
              {showAdvancedClosing ? "Hide" : "Show"} Breakdown
            </button>
          </div>
        </div>
        {showAdvancedClosing && (
          <div className="form-row">
            <div className="form-group">
              <label>Legal Fees</label>
              <input
                name="legal"
                type="number"
                value={inputs.closingCostsBreakdown.legal}
                onChange={handleClosingCostChange}
              />
            </div>
            <div className="form-group">
              <label>Inspection</label>
              <input
                name="inspection"
                type="number"
                value={inputs.closingCostsBreakdown.inspection}
                onChange={handleClosingCostChange}
              />
            </div>
            <div className="form-group">
              <label>Other</label>
              <input
                name="other"
                type="number"
                value={inputs.closingCostsBreakdown.other}
                onChange={handleClosingCostChange}
              />
            </div>
          </div>
        )}
        <div className="form-row">
          <div className="form-group">
            <label>Initial Rehab/Turn Cost</label>
            <input
              name="rehabCost"
              type="number"
              value={inputs.rehabCost}
              onChange={handleChange}
            />
          </div>
          {inputs.propertyType === "STR" && (
            <div className="form-group">
              <label>Furnishings Cost</label>
              <input
                name="furnishingsCost"
                type="number"
                value={inputs.furnishingsCost}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Lender Points / Origination Fees (%)</label>
            <input
              name="lenderPoints"
              type="number"
              value={inputs.lenderPoints}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 3. Financing */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Financing"
          description="Loan terms, interest rate, amortization, second liens, PMI"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Loan Amount</label>
            <input
              name="loanAmount"
              type="number"
              value={inputs.loanAmount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              name="interestRate"
              type="number"
              value={inputs.interestRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Amortization Period (years)</label>
            <input
              name="amortizationYears"
              type="number"
              value={inputs.amortizationYears}
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
          <div className="form-group">
            <label>Payment Frequency</label>
            <select
              name="paymentFrequency"
              value={inputs.paymentFrequency}
              onChange={handleChange}
            >
              <option value="Monthly">Monthly</option>
              <option value="Biweekly">Biweekly</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <label>
            <input
              type="checkbox"
              name="interestOnlyMonths"
              checked={!!inputs.interestOnlyMonths}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  interestOnlyMonths: e.target.checked ? 12 : 0,
                })
              }
            />
            Interest Only Period (months)
          </label>
        </div>

        {/* Advanced financing toggles: second lien / PMI */}
        <div className="form-row">
          <label>
            <input
              type="checkbox"
              checked={showSecondLien}
              onChange={() => setShowSecondLien(!showSecondLien)}
            />
            Show Second Lien / HELOC
          </label>
        </div>
        {showSecondLien && (
          <div className="form-row">
            <div className="form-group">
              <label>Second Lien Amount</label>
              <input
                name="secondLienAmount"
                type="number"
                value={inputs.secondLienAmount}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Second Lien Rate (%)</label>
              <input
                name="secondLienRate"
                type="number"
                value={inputs.secondLienRate}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
        <div className="form-row">
          <label>
            <input
              type="checkbox"
              checked={showPMI}
              onChange={() => setShowPMI(!showPMI)}
            />
            Show Mortgage Insurance (PMI)
          </label>
        </div>
        {showPMI && (
          <div className="form-row">
            <p>
              PMI rules will apply if LTV {">"} threshold (automated
              calculation)
            </p>
          </div>
        )}
      </div>

      {/* 4. Operating Expenses (Fixed Monthly) */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Operating Expenses (Fixed Monthly)"
          description="Property tax, insurance, HOA, utilities, admin costs"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Property Tax ({inputs.currency})</label>
            <input
              name="propertyTax"
              type="number"
              value={inputs.propertyTax}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Insurance ({inputs.currency})</label>
            <input
              name="insurance"
              type="number"
              value={inputs.insurance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>HOA/Strata Fee ({inputs.currency})</label>
            <input
              name="hoaFee"
              type="number"
              value={inputs.hoaFee}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Utilities – Water</label>
            <input
              name="utilitiesWater"
              type="number"
              value={inputs.utilitiesWater}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Utilities – Electric</label>
            <input
              name="utilitiesElectric"
              type="number"
              value={inputs.utilitiesElectric}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Utilities – Internet</label>
            <input
              name="utilitiesInternet"
              type="number"
              value={inputs.utilitiesInternet}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Utilities – Gas</label>
            <input
              name="utilitiesGas"
              type="number"
              value={inputs.utilitiesGas}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Admin Costs ({inputs.currency})</label>
            <input
              name="adminCosts"
              type="number"
              value={inputs.adminCosts}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 5. Operating Expenses (Variable/%) */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Operating Expenses (Variable/%)"
          description="Percent-based operating costs"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Management Fee (%)</label>
            <input
              name="managementFeePercent"
              type="number"
              value={inputs.managementFeePercent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Maintenance Reserve (%)</label>
            <input
              name="maintenanceReservePercent"
              type="number"
              value={inputs.maintenanceReservePercent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>CapEx Reserve (%)</label>
            <input
              name="capexReservePercent"
              type="number"
              value={inputs.capexReservePercent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Leasing / Tenant Placement Fee (%)</label>
            <input
              name="leasingFeePercent"
              type="number"
              value={inputs.leasingFeePercent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Vacancy (%)</label>
            <input
              name="vacancyPercent"
              type="number"
              value={inputs.vacancyPercent}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bad Debt (%)</label>
            <input
              name="badDebtPercent"
              type="number"
              value={inputs.badDebtPercent}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 6. Revenue */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Revenue"
          description="Rental income: LTR or STR"
        />
        {inputs.propertyType !== "STR" ? (
          <div className="form-row">
            <div className="form-group">
              <label>Monthly Rent ({inputs.currency})</label>
              <input
                name="monthlyRent"
                type="number"
                value={inputs.monthlyRent}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Other Income ({inputs.currency})</label>
              <input
                name="otherIncome"
                type="number"
                value={inputs.otherIncome}
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Nightly Rate ({inputs.currency})</label>
                <input
                  name="nightlyRate"
                  type="number"
                  value={inputs.nightlyRate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Occupancy Rate (%)</label>
                <input
                  name="occupancyRate"
                  type="number"
                  value={inputs.occupancyRate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Occupied Nights</label>
                <input
                  name="occupiedNights"
                  type="number"
                  value={inputs.occupiedNights}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <button
                className="be-btn"
                type="button"
                onClick={() => setShowSTRFields(!showSTRFields)}
              >
                {showSTRFields ? "Hide" : "Show"} Seasonal Uplift
              </button>
            </div>
            {showSTRFields && (
              <div className="form-row">
                {inputs.seasonalUplift.map((val, i) => (
                  <div className="form-group" key={i}>
                    <label>{`Month ${i + 1}`}</label>
                    <input
                      type="number"
                      name={`seasonalUplift-${i}`}
                      value={val}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label>Cleaning Fee ({inputs.currency})</label>
                <input
                  name="cleaningFee"
                  type="number"
                  value={inputs.cleaningFee}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Channel / OTA Fee (%)</label>
                <input
                  name="channelFeePercent"
                  type="number"
                  value={inputs.channelFeePercent}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Linen / Turnover Cost ({inputs.currency})</label>
                <input
                  name="linenCost"
                  type="number"
                  value={inputs.linenCost}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Other Upsells ({inputs.currency})</label>
                <input
                  name="upsells"
                  type="number"
                  value={inputs.upsells}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 7. Taxes */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Taxes"
          description="Investor-level tax settings"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Effective Tax Rate (%)</label>
            <input
              name="effectiveTaxRate"
              type="number"
              value={inputs.effectiveTaxRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <button
              className="be-btn"
              type="button"
              onClick={() => setShowAdvancedTaxes(!showAdvancedTaxes)}
            >
              {showAdvancedTaxes ? "Hide" : "Show"} Advanced Taxes
            </button>
          </div>
        </div>
        {showAdvancedTaxes && (
          <div className="form-row">
            <div className="form-group">
              <label>Tax Brackets</label>
              <input
                name="taxBrackets"
                type="text"
                value={inputs.taxBrackets}
                onChange={handleChange}
                placeholder="JSON format: [{rate: xx, upTo: xx}]"
              />
            </div>
            <div className="form-group">
              <label>Depreciation Life (years)</label>
              <input
                name="depreciationLife"
                type="number"
                value={inputs.depreciationLife}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="interestDeductible"
                  checked={inputs.interestDeductible}
                  onChange={handleChange}
                />
                Interest Deductible
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 8. Targets & Constraints */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Targets & Constraints"
          description="DSCR, monthly margin, payback period"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Break-Even Mode</label>
            <select
              name="breakEvenMode"
              value={inputs.breakEvenMode}
              onChange={handleChange}
            >
              <option value="CF=0">Cash Flow = 0</option>
              <option value="DSCR">DSCR Target</option>
              <option value="Margin">Monthly Margin Target</option>
            </select>
          </div>
          <div className="form-group">
            <label>Target DSCR</label>
            <input
              name="targetDSCR"
              type="number"
              value={inputs.targetDSCR}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Target Monthly Margin ({inputs.currency})</label>
            <input
              name="targetMonthlyMargin"
              type="number"
              value={inputs.targetMonthlyMargin}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Target Payback Period (months)</label>
            <input
              name="targetPaybackMonths"
              type="number"
              value={inputs.targetPaybackMonths}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 10. Scenario & UX */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Scenario & Adjustments"
          description="Preset scenarios and manual adjustments for stress testing"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Preset Scenario</label>
            <select
              name="presetScenario"
              value={inputs.presetScenario}
              onChange={handleChange}
            >
              <option value="Base">Base</option>
              <option value="Downside">Downside</option>
              <option value="Upside">Upside</option>
            </select>
          </div>
          <div className="form-group">
            <label>Rent Adjustment (%)</label>
            <input
              name="rentAdjustment"
              type="number"
              value={inputs.rentAdjustment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Occupancy Adjustment (%)</label>
            <input
              name="occupancyAdjustment"
              type="number"
              value={inputs.occupancyAdjustment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Rate Adjustment (%)</label>
            <input
              name="rateAdjustment"
              type="number"
              value={inputs.rateAdjustment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Vacancy Adjustment (%)</label>
            <input
              name="vacancyAdjustment"
              type="number"
              value={inputs.vacancyAdjustment}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 11. Sliders / Advanced UI */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Advanced Controls / Sliders"
          description="Optional sliders for live adjustments"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Rent Adjustment Slider (%)</label>
            <input
              type="range"
              min={-50}
              max={50}
              value={inputs.rentAdjustment}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  rentAdjustment: parseFloat(e.target.value),
                })
              }
            />
            <span>{inputs.rentAdjustment}%</span>
          </div>
          <div className="form-group">
            <label>Occupancy Adjustment Slider (%)</label>
            <input
              type="range"
              min={-50}
              max={50}
              value={inputs.occupancyAdjustment}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  occupancyAdjustment: parseFloat(e.target.value),
                })
              }
            />
            <span>{inputs.occupancyAdjustment}%</span>
          </div>
          <div className="form-group">
            <label>Rate Adjustment Slider (%)</label>
            <input
              type="range"
              min={-50}
              max={50}
              value={inputs.rateAdjustment}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  rateAdjustment: parseFloat(e.target.value),
                })
              }
            />
            <span>{inputs.rateAdjustment}%</span>
          </div>
        </div>
      </div>

      {/* 12. Technical / Dev Options */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Technical / Developer Options"
          description="Units, export options, permalink sharing"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Unit System</label>
            <select
              name="unitSystem"
              value={inputs.unitSystem}
              onChange={handleChange}
            >
              <option value="Metric">Metric</option>
              <option value="Imperial">Imperial</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="dataExport"
                checked={inputs.dataExport}
                onChange={handleChange}
              />
              Enable Data Export (CSV / JSON)
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="permalinkSharing"
                checked={inputs.permalinkSharing}
                onChange={handleChange}
              />
              Enable Permalink Sharing
            </label>
          </div>
        </div>
      </div>

      {/* 13. Submit Button */}
      <div className="form-section">
        <button type="submit" className="submit-button">
          Calculate Break-Even
        </button>
      </div>
    </form>
  );
}

export default BreakEvenForm;
