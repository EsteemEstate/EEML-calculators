// src/investment-calculators/HoldingCost/HoldingCostCharts.jsx
import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(...registerables, ChartDataLabels);

const HoldingCostCharts = ({ results }) => {
  if (!results) return null;

  const { breakdown, monthlyHoldingCost, annualHoldingCost, netHoldingCost } =
    results;

  const safeNumber = (val) => (isNaN(parseFloat(val)) ? 0 : parseFloat(val));

  // --- Pie Chart: Monthly Breakdown ---
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

  // --- Line Chart: Annual Holding Cost Trend (Cumulative) ---
  const monthlyValues = Array.from(
    { length: 12 },
    (_, i) => (i + 1) * safeNumber(monthlyHoldingCost)
  );
  const annualValue = safeNumber(annualHoldingCost);
  monthlyValues[11] = annualValue;

  const lineLabels = [...Array(12).keys()]
    .map((i) => `Month ${i + 1}`)
    .concat("Annual");

  const annualTrendData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Cumulative Holding Cost ($)",
        data: [...monthlyValues, annualValue],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: [...Array(12).fill("#2563eb"), "#f59e0b"],
      },
    ],
  };

  // --- Key Costs Bar Chart ---
  const keyCostsData = {
    labels: ["Monthly", "Annual", "Net"],
    datasets: [
      {
        label: "Cost ($)",
        data: [
          safeNumber(monthlyHoldingCost),
          safeNumber(annualHoldingCost),
          safeNumber(netHoldingCost),
        ],
        backgroundColor: ["#2563eb", "#16a34a", "#f59e0b"],
      },
    ],
  };

  // --- Dynamic step size calculation ---
  const niceStepSize = (() => {
    const maxValue = annualValue * 1.5;
    const roughStep = maxValue / 6; // aim for ~6 ticks
    const magnitude = 10 ** Math.floor(Math.log10(roughStep));
    const residual = roughStep / magnitude;

    if (residual <= 1) return magnitude;
    if (residual <= 2) return 2 * magnitude;
    if (residual <= 5) return 5 * magnitude;
    return 10 * magnitude;
  })();

  // --- Shared Options for Line & Bar ---
  const barLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#000000ff",
        anchor: "end",
        align: "top",
        offset: 5, // push labels slightly inside
        font: { size: 11 },
        formatter: (value, context) => {
          const dataLength = context.chart.data.datasets[0].data.length;
          const index = context.dataIndex;
          // Show first, last, and every 3rd point
          if (index === 0 || index === dataLength - 1 || index % 3 === 0) {
            return `$${Math.round(value).toLocaleString()}`; // no cents
          }
          return "";
        },
      },
    },
    layout: { padding: { top: 30, bottom: 10, left: 0, right: 20 } }, // extra right padding
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: annualValue * 1.5,
        ticks: {
          stepSize: niceStepSize,
          color: "#6b7280",
          font: { size: 12 },
          callback: (val) => `$${val.toLocaleString()}`,
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#6b7280", font: { size: 12 } },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  // --- Pie Chart Options (Restored) ---
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Added to respect container height
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#374151",
          font: { size: 12 },
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, i) => {
              const value = data.datasets[0].data[i];
              return {
                text: `${label}: $${value.toLocaleString()}`,
                fillStyle: data.datasets[0].backgroundColor[i],
              };
            });
          },
        },
      },
      datalabels: {
        color: "#fff",
        font: { size: 11, weight: "bold" },
        anchor: "center",
        align: "end",
        offset: 10,
        formatter: (value, context) => {
          const dataset = context.chart.data.datasets[0].data;
          const total = dataset.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return percentage < 1 ? "" : `${percentage.toFixed(0)}%`;
        },
      },
    },
  };

  return (
    <div className="charts-container flex flex-col gap-6 mt-6">
      {/* 1. Monthly Cost Breakdown - Using specific height from first code */}
      <div className="chart-card" style={{ height: "280px" }}>
        <h3 className="text-lg font-semibold mb-2">Monthly Cost Breakdown</h3>
        <Pie data={breakdownData} options={pieOptions} />
      </div>

      {/* 2. Annual Holding Cost Trend - Using specific height from first code */}
      <div className="chart-card" style={{ height: "320px" }}>
        <h3 className="text-lg font-semibold mb-2">
          Annual Holding Cost Trend
        </h3>
        <div style={{ height: "calc(100% - 32px)" }}>
          <Line data={annualTrendData} options={barLineOptions} />
        </div>
      </div>

      {/* 3. Key Holding Costs - Using specific height from first code */}
      <div className="chart-card" style={{ height: "280px" }}>
        <h3 className="text-lg font-semibold mb-2">Key Holding Costs</h3>
        <div style={{ height: "calc(100% - 32px)" }}>
          <Bar data={keyCostsData} options={barLineOptions} />
        </div>
      </div>
    </div>
  );
};

export default HoldingCostCharts;
