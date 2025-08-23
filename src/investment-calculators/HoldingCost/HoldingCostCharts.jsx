// src/investment-calculators/HoldingCost/HoldingCostCharts.jsx
import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const HoldingCostCharts = ({ results }) => {
  if (!results) return null;

  const {
    breakdown,
    monthlyHoldingCost,
    annualHoldingCost,
    costPerSqFt,
    effectiveHoldingCost,
    rentComparison,
    vacancySensitivity,
    interestRateSensitivity,
  } = results;

  // --- Chart Data ---
  const breakdownData = {
    labels: Object.keys(breakdown),
    datasets: [
      {
        label: "Monthly Breakdown ($)",
        data: Object.values(breakdown),
        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#f59e0b",
          "#dc2626",
          "#9333ea",
          "#14b8a6",
          "#64748b",
          "#ef4444",
        ],
      },
    ],
  };

  const annualTrendData = {
    labels: ["Monthly", "Annual"],
    datasets: [
      {
        label: "Holding Cost ($)",
        data: [monthlyHoldingCost, annualHoldingCost],
        borderColor: "#2563eb",
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const sqFtData = {
    labels: ["Cost per Sq Ft"],
    datasets: [
      {
        label: "Annual Cost per Sq Ft ($)",
        data: [costPerSqFt],
        backgroundColor: "#16a34a",
      },
    ],
  };

  const revenueAdjustedData = {
    labels: ["Gross Holding Cost", "Effective Holding Cost"],
    datasets: [
      {
        label: "Revenue Adjusted ($)",
        data: [monthlyHoldingCost, effectiveHoldingCost],
        backgroundColor: ["#f59e0b", "#10b981"],
      },
    ],
  };

  const scenarioData = {
    labels: [
      "Rent Comparison",
      "Vacancy Sensitivity",
      "Interest Rate Sensitivity",
    ],
    datasets: [
      {
        label: "Scenarios (est.)",
        data: [
          parseFloat(rentComparison), // only works if numeric
          parseFloat(vacancySensitivity),
          parseFloat(interestRateSensitivity),
        ].map((v) => (isNaN(v) ? 0 : v)),
        backgroundColor: ["#2563eb", "#f43f5e", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="charts-container flex flex-col gap-8 mt-6">
      {/* 1. Monthly Cost Breakdown */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold mb-2">Monthly Cost Breakdown</h3>
        <Pie data={breakdownData} />
      </div>

      {/* 2. Annual Holding Cost Trend */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold mb-2">
          Annual Holding Cost Trend
        </h3>
        <Line data={annualTrendData} />
      </div>

      {/* 3. Cost per Sq Ft */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold mb-2">Cost per Sq Ft</h3>
        <Bar data={sqFtData} />
      </div>

      {/* 4. Revenue Adjusted Holding Cost */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold mb-2">
          Revenue Adjusted Holding Cost
        </h3>
        <Bar data={revenueAdjustedData} />
      </div>

      {/* 5. Scenario Sensitivity */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold mb-2">Scenario Sensitivity</h3>
        <Bar data={scenarioData} />
      </div>
    </div>
  );
};

export default HoldingCostCharts;
