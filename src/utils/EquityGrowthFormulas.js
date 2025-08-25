// src/Utils/EquityGrowthFormulas.js

/* ==========================
   Helpers & Normalization
========================== */

// Handles "5" (5%) or "0.05" (5%)
export function parseRate(maybePct) {
  if (maybePct == null || isNaN(maybePct)) return 0;
  const n = Number(maybePct);
  if (n < 0) return 0;
  return n > 1 ? n / 100 : n;
}

export function toDate(d) {
  return d ? new Date(d) : new Date();
}

export function toMonthIndex(dateStr, startDate, horizonMonths) {
  const d = toDate(dateStr);
  const s = toDate(startDate);
  const idx =
    (d.getFullYear() - s.getFullYear()) * 12 + (d.getMonth() - s.getMonth());
  return Math.max(0, Math.min(horizonMonths - 1, idx));
}

// Seeded RNG for Monte Carlo
export function seededRandom(seed) {
  const m = 0x80000000;
  const a = 1103515245;
  const c = 12345;
  let state = seed ? seed : Math.floor(Math.random() * m);
  return function () {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
}

export function randomNormal(rng, mean = 0, stdDev = 1) {
  const u1 = Math.max(rng(), 1e-12);
  const u2 = rng();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

/* ==========================
   Mortgage & Schedules
========================== */

export function calculateMonthlyPayment(principal, annualRate, months) {
  const r = parseRate(annualRate) / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/**
 * extraSchedule: [{ dateMonth: 0-based index, amount }]
 * Returns [{month,balance,interestPaid,principalPaid,extraPayment,totalPayment}]
 */
export function calculateAmortizationSchedule(
  principal,
  annualRate,
  months,
  extraSchedule = []
) {
  const schedule = [];
  let balance = principal;
  const r = parseRate(annualRate) / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);

  for (let m = 0; m < months; m++) {
    if (balance <= 0) {
      schedule.push({
        month: m,
        balance: 0,
        interestPaid: 0,
        principalPaid: 0,
        extraPayment: 0,
        totalPayment: 0,
      });
      continue;
    }
    const interest = balance * r;
    let principalPaid = Math.min(balance, monthlyPayment - interest);

    // Extra principal this month
    const extraPayment = extraSchedule
      .filter((e) => e.dateMonth === m)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    balance = Math.max(0, balance - principalPaid - extraPayment);

    schedule.push({
      month: m,
      balance,
      interestPaid: interest,
      principalPaid,
      extraPayment,
      totalPayment: monthlyPayment + extraPayment,
    });
  }
  return schedule;
}

/* ==========================
   Renovations
========================== */

function normalizeRenoEvents(renoEvents = [], startDate, months) {
  return (renoEvents || []).map((r) => ({
    dateMonth: toMonthIndex(r.date, startDate, months),
    cost: Number(r.cost) || 0,
    uplift: parseRate(r.uplift || 0), // percent uplift on value at that month
  }));
}

function applyRenoEvents(propertyValue, renoEventsNorm, month) {
  let newValue = propertyValue;
  let renoCost = 0;
  renoEventsNorm.forEach((reno) => {
    if (reno.dateMonth === month) {
      newValue *= 1 + (reno.uplift || 0);
      renoCost += reno.cost || 0;
    }
  });
  return { newValue, renoCost };
}

/* ==========================
   Deterministic Engine
========================== */

export function calculateEquityGrowth(rawInputs) {
  const inputs = { ...rawInputs };

  // Dates & horizon
  const startDate = inputs.startDate || new Date().toISOString().split("T")[0];
  const horizonYears = Number(inputs.projectionHorizonYears) || 10;
  const months = Math.max(1, Math.round(horizonYears * 12));

  // Normalize rates
  const appreciation = parseRate(inputs.appreciation || 0.03);
  const inflation = parseRate(inputs.inflation || 0.02);
  const mortgageRate = parseRate(inputs.mortgageRate || 0.05);
  const pmiPercent = parseRate(inputs.pmiPercent || 0);
  const pmiStopLTV = parseRate(inputs.pmiStopLTV || 0.8);
  const propertyTaxRate = parseRate(inputs.propertyTax || 0); // as of value per year
  const maintenanceRate = parseRate(inputs.maintenancePercent || 0);
  const sellingCostsPercent = parseRate(inputs.sellingCostsPercent || 0.06);
  const capitalGainsRate = parseRate(inputs.capitalGainsRate || 0);
  const depreciationRecaptureRate = parseRate(
    inputs.depreciationRecapture || 0
  );

  // Principal & payments
  const homePrice = Number(inputs.homePrice) || 0;
  const mortgagePrincipal =
    Number(inputs.mortgagePrincipal) ||
    Math.max(0, homePrice - (Number(inputs.downPayment) || 0));
  const mortgageTermMonths = Number(inputs.mortgageTermMonths) || 360;

  // Normalize extra principal schedule
  const extraPrincipalScheduleNorm = (inputs.extraPrincipalSchedule || []).map(
    (e) => ({
      dateMonth: toMonthIndex(e.date, startDate, months),
      amount: Number(e.amount) || 0,
    })
  );

  // Normalize reno events
  const renoEventsNorm = normalizeRenoEvents(
    inputs.renoEvents,
    startDate,
    months
  );

  // Arrays
  const propertyValues = [];
  const loanBalances = [];
  const equityValues = [];
  const ltvTimeline = [];
  const monthlyTable = [];
  const eventLog = [];

  // Cost trackers
  let totInterest = 0;
  let totPrincipal = 0;
  let totExtra = 0;
  let totPMI = 0;
  let totTax = 0;
  let totInsurance = 0;
  let totHOA = 0;
  let totMaintenance = 0;
  let totReno = 0;

  // Fixed monthly cost components
  const monthlyInsurance = Number(inputs.insurance)
    ? Number(inputs.insurance) / 12
    : 0; // annual -> monthly
  const monthlyHOA = Number(inputs.hoaFee) || 0;

  // Amortization schedule
  const amort = calculateAmortizationSchedule(
    mortgagePrincipal,
    mortgageRate,
    mortgageTermMonths,
    extraPrincipalScheduleNorm
  );

  // Time loop
  let value = homePrice;
  const mAppreciation = appreciation / 12;
  let pmiEnded = false;
  let pmiEndMonth = null;

  for (let m = 0; m < months; m++) {
    // Appreciation
    value *= 1 + mAppreciation;

    // Renovations
    const reno = applyRenoEvents(value, renoEventsNorm, m);
    value = reno.newValue;
    if (reno.renoCost > 0) {
      totReno += reno.renoCost;
      eventLog.push({
        type: "reno",
        month: m,
        date: monthToDateString(startDate, m),
        cost: reno.renoCost,
      });
    }

    // Mortgage line
    const sched = amort[m] || {
      balance: 0,
      interestPaid: 0,
      principalPaid: 0,
      extraPayment: 0,
      totalPayment: 0,
    };
    const balance = sched.balance;
    const interestPaid = sched.interestPaid;
    const principalPaid = sched.principalPaid;
    const extraPaid = sched.extraPayment;

    totInterest += interestPaid;
    totPrincipal += principalPaid;
    totExtra += extraPaid;

    // PMI (until LTV <= stop)
    let pmi = 0;
    const ltvNow = value > 0 ? balance / value : 0;
    if (inputs.pmiEnabled && !pmiEnded && pmiPercent > 0 && balance > 0) {
      if (ltvNow <= pmiStopLTV) {
        pmiEnded = true;
        pmiEndMonth = m;
        eventLog.push({
          type: "pmi_end",
          month: m,
          date: monthToDateString(startDate, m),
          ltv: ltvNow,
        });
      } else {
        pmi = (pmiPercent / 12) * balance;
      }
    }
    totPMI += pmi;

    // Carry costs
    const tax = (propertyTaxRate * value) / 12; // % of value, monthly
    const insurance = monthlyInsurance;
    const hoa = monthlyHOA;
    const maintenance = (maintenanceRate * value) / 12;

    totTax += tax;
    totInsurance += insurance;
    totHOA += hoa;
    totMaintenance += maintenance;

    propertyValues.push(value);
    loanBalances.push(balance);

    const equity = value - balance;
    equityValues.push(equity);
    ltvTimeline.push(ltvNow);

    // Save monthly row
    monthlyTable.push({
      monthIndex: m,
      date: monthToDateString(startDate, m),
      propertyValue: value,
      appreciationPctMonthly: mAppreciation,
      loanBalance: balance,
      interestPaid,
      principalPaid,
      extraPrincipal: extraPaid,
      pmi,
      tax,
      insurance,
      hoa,
      maintenance,
      ltv: ltvNow,
      equity,
      renoCostThisMonth: reno.renoCost,
    });
  }

  // KPIs
  const equityToday = Math.max(0, homePrice - mortgagePrincipal); // at t0
  const lastIdx = months - 1;
  const lastValue = propertyValues[lastIdx] || homePrice;
  const lastBalance = loanBalances[lastIdx] || 0;
  const equityAtHorizon = lastValue - lastBalance;

  // Exit economics
  const sellingCosts = sellingCostsPercent * lastValue; // based on sale price
  // Simple CGT model: gains = (sale - basis), basis = purchase + reno costs
  const simpleGain = Math.max(0, lastValue - (homePrice + totReno));
  const capitalGainsTax = capitalGainsRate * simpleGain;
  // Simple depreciation recapture (if provided, use as % of gain)
  const depreciationRecaptureTax = depreciationRecaptureRate * simpleGain;

  const netAfterSale =
    lastValue -
    sellingCosts -
    lastBalance -
    capitalGainsTax -
    depreciationRecaptureTax;

  // CAGR (from down payment to equityAtHorizon — nominal)
  const equityCAGR =
    equityToday > 0
      ? Math.pow(
          (equityAtHorizon || 1) / equityToday,
          1 / (horizonYears || 1)
        ) - 1
      : 0;

  // Sources & Drivers (at horizon)
  const equitySources = [
    {
      label: "Down Payment",
      amount:
        Number(inputs.downPayment) ||
        Math.max(0, homePrice - mortgagePrincipal),
    },
    { label: "Principal Repaid", amount: totPrincipal + totExtra },
    {
      label: "Net Appreciation (incl. reno uplift − cost)",
      amount: lastValue - (homePrice + totReno),
    },
    { label: "− Liens/HELOC", amount: 0 },
    { label: "− Selling Costs", amount: -sellingCosts },
    {
      label: "− Taxes (CGT/Recapture)",
      amount: -(capitalGainsTax + depreciationRecaptureTax),
    },
    { label: "Net After-Sale Equity", amount: netAfterSale },
  ];

  // Cost Breakdown (lifetime over horizon)
  const costBreakdown = {
    totalInterestPaid: totInterest,
    totalPrincipalPaid: totPrincipal,
    totalExtraPaid: totExtra,
    totalPMI: totPMI,
    totalPropertyTax: totTax,
    totalInsurance: totInsurance,
    totalHOA: totHOA,
    totalMaintenance: totMaintenance,
    totalRenoCosts: totReno,
    sellingCosts,
    capitalGainsTax,
    depreciationRecaptureTax,
    totalCashOutflow:
      totInterest +
      totPMI +
      totTax +
      totInsurance +
      totHOA +
      totMaintenance +
      totReno +
      sellingCosts +
      capitalGainsTax +
      depreciationRecaptureTax,
  };

  return {
    // timelines (aliases for your charts/results)
    propertyValues,
    loanBalances,
    equityValues,
    equityTimeline: equityValues, // alias
    ltvTimeline,
    monthlyTable,

    // KPIs
    equityToday,
    equityAtHorizon,
    netAfterSale,
    equityCAGR,

    // Decomposition
    equitySources,
    costBreakdown,

    // Logs & meta
    eventLog,
    currency: inputs.currency || "USD",
  };
}

/* ==========================
   Monte Carlo (equity only)
========================== */

export function monteCarloEquity(inputs) {
  const months = Math.max(
    1,
    Math.round((Number(inputs.projectionHorizonYears) || 10) * 12)
  );
  const rng = seededRandom(inputs.monteCarloSeed || 42);

  const mean =
    parseRate(inputs.monteCarloMean ?? inputs.appreciation ?? 0.03) / 12;
  const vol = (Number(inputs.monteCarloVolatility) || 0.03) / Math.sqrt(12);

  // Mortgage schedule (deterministic)
  const amort = calculateAmortizationSchedule(
    Number(inputs.mortgagePrincipal) || 0,
    parseRate(inputs.mortgageRate || 0.05),
    Number(inputs.mortgageTermMonths) || 360,
    (inputs.extraPrincipalSchedule || []).map((e) => ({
      dateMonth: toMonthIndex(e.date, inputs.startDate, months),
      amount: Number(e.amount) || 0,
    }))
  );

  const renoNorm = normalizeRenoEvents(
    inputs.renoEvents,
    inputs.startDate,
    months
  );

  const sims = inputs.monteCarloRuns || 1000;
  const paths = [];

  for (let s = 0; s < sims; s++) {
    let v = Number(inputs.homePrice) || 0;
    const eq = [];
    for (let m = 0; m < months; m++) {
      const step = randomNormal(rng, mean, vol);
      v *= 1 + step;
      const reno = applyRenoEvents(v, renoNorm, m);
      v = reno.newValue;
      const bal = amort[m]?.balance || 0;
      eq.push(v - bal);
    }
    paths.push(eq);
  }

  const percentiles = { P5: [], P50: [], P95: [] };
  for (let m = 0; m < months; m++) {
    const arr = paths.map((p) => p[m]).sort((a, b) => a - b);
    const idx = (p) =>
      Math.max(0, Math.min(arr.length - 1, Math.floor((p / 100) * arr.length)));
    percentiles.P5.push(arr[idx(5)]);
    percentiles.P50.push(arr[idx(50)]);
    percentiles.P95.push(arr[idx(95)]);
  }
  return percentiles;
}

/* ==========================
   Main Entry
========================== */

export function calculateEquityGrowthWithMC(inputs) {
  const res = calculateEquityGrowth(inputs);
  if (inputs.monteCarloEnabled) {
    res.mcPercentiles = monteCarloEquity(inputs);
  }
  return res;
}

/* ==========================
   Utils
========================== */

function monthToDateString(startDateStr, monthIndex) {
  const d = toDate(startDateStr);
  d.setMonth(d.getMonth() + monthIndex);
  // YYYY-MM-01 style
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = "01";
  return `${yyyy}-${mm}-${dd}`;
}
