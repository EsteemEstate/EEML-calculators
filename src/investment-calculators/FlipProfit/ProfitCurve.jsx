// =============================
// File: ProfitCurve.jsx
// =============================
import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

const ProfitCurve = ({ data, inputs }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !inputs || !chartRef.current) return;

    // Generate data points for the chart
    const generateProfitCurveData = () => {
      const points = [];
      const minPrice = inputs.purchasePrice * 0.7; // 30% below purchase
      const maxPrice = inputs.arv * 1.3; // 30% above ARV
      const step = (maxPrice - minPrice) / 20; // 20 data points

      for (let price = minPrice; price <= maxPrice; price += step) {
        // Create modified inputs with the current sale price
        const modifiedInputs = {
          ...inputs,
          arv: price,
        };

        // Calculate profit for this price point
        const result = calculateFlip(modifiedInputs);
        points.push({
          salePrice: Math.round(price),
          profit: Math.round(result.netProfit),
          roi: result.roi,
        });
      }

      return points;
    };

    const chartData = generateProfitCurveData();

    // Format labels as currency
    const labels = chartData.map((item) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(item.salePrice)
    );

    // Find break-even point
    const breakEvenPoint = chartData.find((point) => point.profit >= 0);
    const breakEvenIndex = breakEvenPoint
      ? chartData.indexOf(breakEvenPoint)
      : -1;

    // Chart configuration
    const config = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Profit ($)",
            data: chartData.map((item) => item.profit),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.1,
            yAxisID: "y",
            borderWidth: 2,
          },
          {
            label: "ROI (%)",
            data: chartData.map((item) => item.roi),
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            tension: 0.1,
            yAxisID: "y1",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: "Profit Curve vs Sale Price",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.datasetIndex === 0) {
                  label += new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(context.raw);
                } else {
                  label += context.raw.toFixed(2) + "%";
                }
                return label;
              },
            },
          },
          annotation:
            breakEvenIndex >= 0
              ? {
                  annotations: {
                    line1: {
                      type: "line",
                      yMin: 0,
                      yMax: 0,
                      borderColor: "rgb(255, 99, 132)",
                      borderWidth: 2,
                      borderDash: [6, 6],
                      label: {
                        content: "Break-even",
                        enabled: true,
                        position: "right",
                      },
                    },
                    point1: {
                      type: "point",
                      xValue: breakEvenIndex,
                      yValue: 0,
                      radius: 5,
                      backgroundColor: "rgba(255, 99, 132, 0.5)",
                      borderColor: "rgb(255, 99, 132)",
                      borderWidth: 2,
                      label: {
                        content: "Break-even: " + labels[breakEvenIndex],
                        enabled: true,
                      },
                    },
                  },
                }
              : undefined,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Sale Price",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Profit ($)",
            },
            ticks: {
              callback: function (value) {
                return new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(value);
              },
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "ROI (%)",
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function (value) {
                return value.toFixed(0) + "%";
              },
            },
          },
        },
      },
    };

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart instance
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, config);

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, inputs]);

  if (!data || !inputs) return null;

  return (
    <div className="profit-curve-container">
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>
      <div className="chart-annotations">
        <p>
          Current ARV:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(inputs.arv)}
        </p>
      </div>
    </div>
  );
};

// Replicate the calculateFlip function from your form component
const calculateFlip = (inputs) => {
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
    (inputs.rehabFinanced ? 0 : inputs.rehabBudget);

  // 5. Calculate total project cost
  const totalProjectCost =
    inputs.purchasePrice +
    totalRehabCost +
    upfrontCosts +
    holdingCosts +
    inputs.regionalPurchaseTaxes;

  // 6. Loan payoff calculation
  const totalInterest =
    loanAmount * (inputs.interestRate / 100) * (inputs.timelineMonths / 12);

  const loanPayoff = inputs.interestOnly
    ? loanAmount + totalInterest
    : loanAmount -
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

  return {
    netProfit,
    roi,
    annualizedRoi,
    totalProjectCost,
    totalCashInvested: cashInvested,
    payoffBalance: loanPayoff,
    saleCosts,
  };
};

// Helper functions
const pmt = (rateMonthly, nPeriods, principal) => {
  if (rateMonthly === 0) return principal / nPeriods;
  const r = rateMonthly;
  return (principal * r) / (1 - Math.pow(1 + r, -nPeriods));
};

export default ProfitCurve;
