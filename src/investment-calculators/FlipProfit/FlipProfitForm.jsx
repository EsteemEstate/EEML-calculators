import React, { useState } from "react";

// --- Finance helpers ---
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const pmt = (rateMonthly, nPeriods, principal) => {
  if (rateMonthly === 0) return principal / nPeriods;
  const r = rateMonthly;
  return (principal * r) / (1 - Math.pow(1 + r, -nPeriods));
};

function calculateFlip(inputs) {
  const {
    // A. Acquisition
    purchasePrice = 0,
    closingCosts = 0,
    lenderPointsPct = 0,
    lenderOriginationFee = 0,
    lenderUnderwritingFee = 0,
    cashPercent = 0,

    // B. Financing
    loanAmount: loanAmountRaw = 0,
    interestRate = 0,
    loanTermYears = 30,
    interestOnly = true,
    rehabFinanced = true,

    // C. Rehab
    rehabBudget = 0,
    contingencyPct = 0,
    timelineMonths = 6,

    // D. Holding
    propertyTaxAnnual = 0,
    insuranceMonthly = 0,
    utilitiesMonthly = 0,
    hoaMonthly = 0,
    maintenanceMonthly = 0,

    // E. Sale
    arv = 0,
    agentCommissionPct = 0,
    stagingMarketing = 0,
    sellerClosingCosts = 0,
    regionalPurchaseTaxes = 0,
    regionalSaleTransferTaxes = 0,
  } = inputs || {};

  // Loan amount resolution
  let loanAmount = loanAmountRaw;
  if (!loanAmount && cashPercent > 0 && cashPercent <= 100) {
    const cashFrac = clamp(cashPercent / 100, 0, 1);
    loanAmount = Math.max(0, purchasePrice * (1 - cashFrac));
  }

  const pointsFee = (lenderPointsPct / 100) * loanAmount;
  const lenderFees = pointsFee + lenderOriginationFee + lenderUnderwritingFee;

  const rehabContingency = (contingencyPct / 100) * rehabBudget;
  const totalRehab = rehabBudget + rehabContingency;

  const acquisitionCash =
    purchasePrice +
    closingCosts +
    regionalPurchaseTaxes +
    lenderFees -
    loanAmount;

  const rMonthly = interestRate / 100 / 12;
  const baseHoldMonthly =
    propertyTaxAnnual / 12 +
    insuranceMonthly +
    utilitiesMonthly +
    hoaMonthly +
    maintenanceMonthly;

  const drawMonths = Math.max(
    1,
    Math.floor(Math.min(timelineMonths, Math.ceil(timelineMonths / 2)))
  );
  const rehabDrawPerMonth = rehabFinanced ? totalRehab / drawMonths : 0;

  let interestCarryTotal = 0;
  let monthlyCashFlow = [];
  let principalOutstanding = loanAmount;
  const amortPayment = !interestOnly
    ? pmt(rMonthly, loanTermYears * 12, loanAmount)
    : 0;

  for (let m = 1; m <= timelineMonths; m++) {
    if (rehabFinanced && m <= drawMonths) {
      principalOutstanding += rehabDrawPerMonth; // draws capitalized
    }

    const interestComponent = principalOutstanding * rMonthly;
    const debtService = interestOnly ? interestComponent : amortPayment;
    interestCarryTotal += interestComponent;

    const rehabSpend = rehabFinanced
      ? 0
      : m <= drawMonths
      ? totalRehab / drawMonths
      : 0;
    const monthOutflows = baseHoldMonthly + debtService + rehabSpend;

    monthlyCashFlow.push({
      month: m,
      outflows: monthOutflows,
      interest: interestComponent,
      rehabSpend,
      baseHold: baseHoldMonthly,
      debtService,
      principalOutstanding,
    });

    if (!interestOnly) {
      const principalPaid = Math.max(0, debtService - interestComponent);
      principalOutstanding = Math.max(0, principalOutstanding - principalPaid);
    }
  }

  const payoffBalance = principalOutstanding; // amount to clear at sale

  const agentFee = (agentCommissionPct / 100) * arv;
  const fixedSaleCosts =
    stagingMarketing + sellerClosingCosts + regionalSaleTransferTaxes;
  const saleCosts = agentFee + fixedSaleCosts;

  const grossSaleProceeds = arv;
  const netSaleProceedsBeforeDebt = grossSaleProceeds - saleCosts;

  const totalHoldCash = monthlyCashFlow.reduce((s, m) => s + m.outflows, 0);

  const netCashAtSale = netSaleProceedsBeforeDebt - payoffBalance;

  // Total cash invested (equity out-of-pocket)
  const totalCashInvested = Math.max(0, acquisitionCash + totalHoldCash);

  // Project cost for reporting
  const totalProjectCost =
    purchasePrice +
    closingCosts +
    regionalPurchaseTaxes +
    lenderFees +
    totalRehab +
    totalHoldCash +
    saleCosts;

  // Net profit
  const netProfit = netCashAtSale - (acquisitionCash + totalHoldCash);

  const roi = totalCashInvested > 0 ? (netProfit / totalCashInvested) * 100 : 0;
  const annualizedRoi =
    timelineMonths > 0
      ? ((1 + netProfit / (totalCashInvested || 1)) ** (12 / timelineMonths) -
          1) *
        100
      : 0;

  // Break-even sale price
  const c = agentCommissionPct / 100;
  const cashOutflows = acquisitionCash + totalHoldCash;
  const breakEvenSalePrice =
    (payoffBalance + cashOutflows + fixedSaleCosts) / (1 - c || 1);

  // Profit curve (±40% band around ARV, min 30 steps)
  const minSP = Math.max(0, arv * 0.6);
  const maxSP = Math.max(arv, arv * 1.4);
  const steps = 30;
  const profitCurve = Array.from({ length: steps + 1 }, (_, i) => {
    const sp = minSP + ((maxSP - minSP) * i) / steps;
    const saleCostsVar = c * sp + fixedSaleCosts;
    const netSaleVar = sp - saleCostsVar - payoffBalance;
    const profitVar = netSaleVar - cashOutflows;
    return { sp, profit: profitVar };
  });

  // Cash flow timeline: last month add sale inflow
  const timeline = monthlyCashFlow.map((m) => ({ ...m }));
  if (timeline.length > 0) {
    const last = timeline.length - 1;
    timeline[last].saleProceeds = netCashAtSale;
    timeline[last].netMonth = netCashAtSale - timeline[last].outflows;
  }

  // Sensitivity (±10% simple)
  const reCalc = (over) => calculateFlip({ ...inputs, ...over });
  const sens = [
    {
      label: "ARV",
      up: reCalc({ arv: arv * 1.1 }).netProfit,
      down: reCalc({ arv: arv * 0.9 }).netProfit,
    },
    {
      label: "Rehab Cost",
      up: reCalc({ rehabBudget: rehabBudget * 1.1 }).netProfit,
      down: reCalc({ rehabBudget: rehabBudget * 0.9 }).netProfit,
    },
    {
      label: "Hold Time (mo)",
      up: reCalc({ timelineMonths: Math.round(timelineMonths * 1.2) })
        .netProfit,
      down: reCalc({
        timelineMonths: Math.max(1, Math.round(timelineMonths * 0.8)),
      }).netProfit,
    },
    {
      label: "Interest Rate",
      up: reCalc({ interestRate: interestRate + 2 }).netProfit,
      down: reCalc({ interestRate: Math.max(0, interestRate - 2) }).netProfit,
    },
  ].map((s) => ({
    label: s.label,
    deltaUp: s.up - netProfit,
    deltaDown: netProfit - s.down,
  }));

  // Leverage sweep: ROI vs LTV (0..90%)
  const leverageSeries = Array.from({ length: 10 }, (_, i) => 0.1 * i).map(
    (ltv) => {
      const la = purchasePrice * ltv;
      const tmp = calculateFlip({ ...inputs, loanAmount: la, cashPercent: 0 });
      return {
        ltv: Math.round(ltv * 100),
        roi: tmp.roi,
        netProfit: tmp.netProfit,
      };
    }
  );

  return {
    inputs: { ...inputs, loanAmount },
    acquisitionCash,
    lenderFees,
    totalRehab,
    rehabContingency,
    interestCarryTotal,
    totalHoldCash,
    payoffBalance,
    saleCosts,
    agentFee,
    grossSaleProceeds,
    netSaleProceedsBeforeDebt,
    netCashAtSale,
    totalProjectCost,
    totalCashInvested,
    netProfit,
    roi,
    annualizedRoi,
    roe: roi,
    breakEvenSalePrice,
    profitCurve,
    timeline,
    sensitivity: sens,
    leverageSeries,
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
    loanTermYears: 30,
    interestOnly: true,
    rehabFinanced: true,

    // C. Rehab
    rehabBudget: "",
    contingencyPct: 10,
    timelineMonths: 6,

    // D. Holding
    propertyTaxAnnual: "",
    insuranceMonthly: "",
    utilitiesMonthly: "",
    hoaMonthly: "",
    maintenanceMonthly: "",

    // E. Sale
    arv: "",
    agentCommissionPct: 5,
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

    const v = {
      ...inputs,
      purchasePrice: inputs.purchasePrice || 0,
      closingCosts: inputs.closingCosts || 0,
      lenderPointsPct: inputs.lenderPointsPct || 0,
      lenderOriginationFee: inputs.lenderOriginationFee || 0,
      lenderUnderwritingFee: inputs.lenderUnderwritingFee || 0,
      cashPercent: inputs.cashPercent || 0,

      loanAmount: inputs.loanAmount || 0,
      interestRate: inputs.interestRate || 0,
      loanTermYears: inputs.loanTermYears || 30,
      interestOnly: !!inputs.interestOnly,
      rehabFinanced: !!inputs.rehabFinanced,

      rehabBudget: inputs.rehabBudget || 0,
      contingencyPct: inputs.contingencyPct || 0,
      timelineMonths: inputs.timelineMonths || 6,

      propertyTaxAnnual: inputs.propertyTaxAnnual || 0,
      insuranceMonthly: inputs.insuranceMonthly || 0,
      utilitiesMonthly: inputs.utilitiesMonthly || 0,
      hoaMonthly: inputs.hoaMonthly || 0,
      maintenanceMonthly: inputs.maintenanceMonthly || 0,

      arv: inputs.arv || 0,
      agentCommissionPct: inputs.agentCommissionPct || 0,
      stagingMarketing: inputs.stagingMarketing || 0,
      sellerClosingCosts: inputs.sellerClosingCosts || 0,

      regionalPurchaseTaxes: inputs.regionalPurchaseTaxes || 0,
      regionalSaleTransferTaxes: inputs.regionalSaleTransferTaxes || 0,
    };

    const res = calculateFlip(v);
    setResults(res);
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
