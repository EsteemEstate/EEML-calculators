import React, { useState } from "react";
import FlipProfitResults from "./FlipProfitResults";

// --- Finance helpers ---
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const pmt = (rateMonthly, nPeriods, principal) => {
  if (rateMonthly === 0) return principal / nPeriods;
  const r = rateMonthly;
  return (principal * r) / (1 - Math.pow(1 + r, -nPeriods));
};

function calculateFlip(inputs) {
  // 1. Calculate loan amount if not provided
  const loanAmount =
    inputs.loanAmount || inputs.purchasePrice * (1 - inputs.cashPercent / 100);

  // 2. Calculate monthly interest rate for amortized loans
  const monthlyRate = inputs.interestRate / 100 / 12;

  // 3. Calculate all cost components
  const upfrontCosts =
    inputs.closingCosts +
    (loanAmount * inputs.lenderPointsPct) / 100 +
    inputs.lenderOriginationFee +
    inputs.lenderUnderwritingFee;

  const monthlyHoldingCosts =
    inputs.propertyTaxAnnual / 12 +
    inputs.insuranceMonthly +
    inputs.utilitiesMonthly +
    inputs.hoaMonthly +
    inputs.maintenanceMonthly;

  const holdingCosts = monthlyHoldingCosts * inputs.timelineMonths;
  const totalRehabCost = inputs.rehabBudget * (1 + inputs.contingencyPct / 100);

  // 4. Calculate cash invested (actual out-of-pocket)
  const cashInvested =
    (inputs.purchasePrice * inputs.cashPercent) / 100 +
    upfrontCosts +
    (inputs.rehabFinanced ? 0 : inputs.rehabBudget); // Only include actual rehab spent, not contingency

  // 5. Calculate total project cost
  const totalProjectCost =
    inputs.purchasePrice +
    totalRehabCost + // Includes contingency here
    upfrontCosts +
    holdingCosts +
    inputs.regionalPurchaseTaxes;

  // 6. CORRECTED LOAN PAYOFF CALCULATION
  const totalInterest =
    loanAmount * (inputs.interestRate / 100) * (inputs.timelineMonths / 12);

  const loanPayoff = inputs.interestOnly
    ? loanAmount + totalInterest // Interest-only: principal + accrued interest
    : loanAmount - // Amortized: subtract principal paid during hold period
      (pmt(monthlyRate, inputs.loanTermYears * 12, loanAmount) *
        inputs.timelineMonths -
        totalInterest);

  // 7. Calculate sale costs
  const commission = inputs.arv * (inputs.agentCommissionPct / 100);
  const saleCosts =
    commission +
    inputs.stagingMarketing +
    inputs.sellerClosingCosts +
    inputs.regionalSaleTransferTaxes;

  // 8. Calculate net profit
  const netProfit = inputs.arv - totalProjectCost - saleCosts - loanPayoff;

  // 9. Calculate ROI metrics
  const roi = (netProfit / cashInvested) * 100;
  const annualizedRoi = roi * (12 / inputs.timelineMonths);

  // 10. Calculate break-even sale price
  const totalFixedSaleCosts =
    inputs.stagingMarketing +
    inputs.sellerClosingCosts +
    inputs.regionalSaleTransferTaxes;
  const breakEvenSalePrice =
    (totalProjectCost + loanPayoff + totalFixedSaleCosts) /
    (1 - inputs.agentCommissionPct / 100);

  return {
    netProfit,
    roi,
    annualizedRoi,
    breakEvenSalePrice,
    totalProjectCost,
    totalCashInvested: cashInvested,
    payoffBalance: loanPayoff,
    saleCosts,
    costBreakdown: {
      purchasePrice: inputs.purchasePrice,
      rehabCost: totalRehabCost,
      upfrontCosts,
      holdingCosts,
      loanDetails: {
        principal: loanAmount,
        interestPaid: totalInterest,
        totalPayoff: loanPayoff,
      },
      saleCostDetails: {
        commission,
        otherCosts: saleCosts - commission,
      },
    },
  };
}
const SectionTitleWithTooltip = ({ title, description }) => (
  <div className="section-title-container">
    <h2 className="section-title">{title}</h2>
    <div className="tooltip">
      <span className="tooltip-text">{description}</span>
    </div>
  </div>
);

function FlipProfitForm({ setResults }) {
  const [inputs, setInputs] = useState({
    // A. Acquisition
    purchasePrice: "",
    closingCosts: "",
    lenderPointsPct: "",
    lenderOriginationFee: "",
    lenderUnderwritingFee: "",
    cashPercent: "",

    // B. Financing
    loanAmount: "",
    interestRate: "",
    loanTermYears: "",
    interestOnly: false,
    rehabFinanced: false,

    // C. Rehab
    rehabBudget: "",
    contingencyPct: "",
    timelineMonths: "",

    // D. Holding
    propertyTaxAnnual: "",
    insuranceMonthly: "",
    utilitiesMonthly: "",
    hoaMonthly: "",
    maintenanceMonthly: "",

    // E. Sale
    arv: "",
    agentCommissionPct: "",
    stagingMarketing: "",
    sellerClosingCosts: "",

    // Regional (optional)
    regionalPurchaseTaxes: "",
    regionalSaleTransferTaxes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setInputs((s) => ({ ...s, [name]: checked }));
    } else {
      setInputs((s) => ({
        ...s,
        [name]: value === "" ? "" : parseFloat(value),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with inputs:", inputs);

    // Convert all values to numbers and provide fallbacks
    const preparedInputs = {
      purchasePrice: Number(inputs.purchasePrice) || 0,
      closingCosts: Number(inputs.closingCosts) || 0,
      lenderPointsPct: Number(inputs.lenderPointsPct) || 0,
      lenderOriginationFee: Number(inputs.lenderOriginationFee) || 0,
      lenderUnderwritingFee: Number(inputs.lenderUnderwritingFee) || 0,
      cashPercent: Number(inputs.cashPercent) || 0,
      loanAmount: Number(inputs.loanAmount) || 0,
      interestRate: Number(inputs.interestRate) || 0,
      loanTermYears: Number(inputs.loanTermYears) || 30,
      interestOnly: Boolean(inputs.interestOnly),
      rehabFinanced: Boolean(inputs.rehabFinanced),
      rehabBudget: Number(inputs.rehabBudget) || 0,
      contingencyPct: Number(inputs.contingencyPct) || 0,
      timelineMonths: Number(inputs.timelineMonths) || 6,
      propertyTaxAnnual: Number(inputs.propertyTaxAnnual) || 0,
      insuranceMonthly: Number(inputs.insuranceMonthly) || 0,
      utilitiesMonthly: Number(inputs.utilitiesMonthly) || 0,
      hoaMonthly: Number(inputs.hoaMonthly) || 0,
      maintenanceMonthly: Number(inputs.maintenanceMonthly) || 0,
      arv: Number(inputs.arv) || 0,
      agentCommissionPct: Number(inputs.agentCommissionPct) || 0,
      stagingMarketing: Number(inputs.stagingMarketing) || 0,
      sellerClosingCosts: Number(inputs.sellerClosingCosts) || 0,
      regionalPurchaseTaxes: Number(inputs.regionalPurchaseTaxes) || 0,
      regionalSaleTransferTaxes: Number(inputs.regionalSaleTransferTaxes) || 0,
    };

    console.log("Prepared inputs for calculation:", preparedInputs);

    try {
      const calculationResults = calculateFlip(preparedInputs);
      console.log("Calculation results:", calculationResults);

      if (calculationResults) {
        setResults(calculationResults);
      } else {
        console.error("Calculation returned no results");
      }
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* A. Acquisition */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="A. Acquisition"
          description="Purchase price, closing & lender fees, and cash vs loan mix"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Purchase Price ($)</label>
            <input
              name="purchasePrice"
              type="number"
              value={inputs.purchasePrice}
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
            <label>Cash Portion (%)</label>
            <input
              name="cashPercent"
              type="number"
              step="0.1"
              value={inputs.cashPercent}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Lender Points (%)</label>
            <input
              name="lenderPointsPct"
              type="number"
              step="0.1"
              value={inputs.lenderPointsPct}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Origination Fee ($)</label>
            <input
              name="lenderOriginationFee"
              type="number"
              value={inputs.lenderOriginationFee}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Underwriting Fee ($)</label>
            <input
              name="lenderUnderwritingFee"
              type="number"
              value={inputs.lenderUnderwritingFee}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* B. Financing */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="B. Financing"
          description="Loan amount, IO vs amortized, and rehab draws"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Loan Amount ($) [optional]</label>
            <input
              name="loanAmount"
              type="number"
              value={inputs.loanAmount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (APR %)</label>
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
              name="loanTermYears"
              type="number"
              value={inputs.loanTermYears}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>
              <input
                name="interestOnly"
                type="checkbox"
                checked={!!inputs.interestOnly}
                onChange={handleChange}
              />{" "}
              Interest-Only
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                name="rehabFinanced"
                type="checkbox"
                checked={!!inputs.rehabFinanced}
                onChange={handleChange}
              />{" "}
              Rehab Draws Financed
            </label>
          </div>
        </div>
      </div>

      {/* C. Rehab */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="C. Rehab / Renovation"
          description="Budget, contingency, and timeline"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Rehab Budget ($)</label>
            <input
              name="rehabBudget"
              type="number"
              value={inputs.rehabBudget}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Contingency (%)</label>
            <input
              name="contingencyPct"
              type="number"
              step="0.1"
              value={inputs.contingencyPct}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Timeline (months)</label>
            <input
              name="timelineMonths"
              type="number"
              value={inputs.timelineMonths}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* D. Holding */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="D. Holding Costs"
          description="Monthly unless noted"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Property Tax (annual $)</label>
            <input
              name="propertyTaxAnnual"
              type="number"
              value={inputs.propertyTaxAnnual}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Insurance ($/mo)</label>
            <input
              name="insuranceMonthly"
              type="number"
              value={inputs.insuranceMonthly}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Utilities ($/mo)</label>
            <input
              name="utilitiesMonthly"
              type="number"
              value={inputs.utilitiesMonthly}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>HOA/Strata ($/mo)</label>
            <input
              name="hoaMonthly"
              type="number"
              value={inputs.hoaMonthly}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Maintenance ($/mo)</label>
            <input
              name="maintenanceMonthly"
              type="number"
              value={inputs.maintenanceMonthly}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* E. Sale */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="E. Sale"
          description="ARV and disposition costs"
        />
        <div className="form-row">
          <div className="form-group">
            <label>After-Repair Value (ARV) ($)</label>
            <input
              name="arv"
              type="number"
              value={inputs.arv}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Agent Commission (%)</label>
            <input
              name="agentCommissionPct"
              type="number"
              step="0.1"
              value={inputs.agentCommissionPct}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Staging/Marketing ($)</label>
            <input
              name="stagingMarketing"
              type="number"
              value={inputs.stagingMarketing}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Seller Closing Costs ($)</label>
            <input
              name="sellerClosingCosts"
              type="number"
              value={inputs.sellerClosingCosts}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Regional (optional) */}
      <div className="form-section">
        <SectionTitleWithTooltip
          title="Regional (optional)"
          description="Purchase duties / transfer taxes at sale"
        />
        <div className="form-row">
          <div className="form-group">
            <label>Purchase Taxes ($)</label>
            <input
              name="regionalPurchaseTaxes"
              type="number"
              value={inputs.regionalPurchaseTaxes}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Sale Transfer Taxes ($)</label>
            <input
              name="regionalSaleTransferTaxes"
              type="number"
              value={inputs.regionalSaleTransferTaxes}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button">
        Calculate
      </button>
    </form>
  );
}

export default FlipProfitForm;
