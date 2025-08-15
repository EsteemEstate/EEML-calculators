import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SensitivityAnalysisChart = ({ data }) => {
  if (!data || !data.holdingPeriod || data.holdingPeriod <= 0) return null;

  const holdingYears = Number(data.holdingPeriod) || 10;
  const baseAnnualRent = (Number(data.rent) || 0) * 12;
  const baseAnnualExpenses =
    (Number(data.taxes) || 0) +
    (Number(data.insurance) || 0) +
    (Number(data.maintenance) || 0) +
    (Number(data.propertyManagement) || 0) +
    (Number(data.utilities) || 0);
  const totalInvestment =
    (Number(data.downPayment) || 0) + (Number(data.closingCosts) || 0);

  const [opExChange, setOpExChange] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState(2);

  const scenarios = useMemo(() => {
    const bestCase = [];
    const likelyCase = [];
    const worstCase = [];

    for (let year = 1; year <= holdingYears; year++) {
      const rentGrowthFactor = 1 + revenueGrowth / 100;
      const expensesFactorBest = 1 + (opExChange - 5) / 100;
      const expensesFactorLikely = 1 + opExChange / 100;
      const expensesFactorWorst = 1 + (opExChange + 5) / 100;

      const annualRent = baseAnnualRent * Math.pow(rentGrowthFactor, year - 1);
      const expensesBest =
        baseAnnualExpenses * Math.pow(expensesFactorBest, year - 1);
      const expensesLikely =
        baseAnnualExpenses * Math.pow(expensesFactorLikely, year - 1);
      const expensesWorst =
        baseAnnualExpenses * Math.pow(expensesFactorWorst, year - 1);

      const cashFlowBest = annualRent - expensesBest;
      const cashFlowLikely = annualRent - expensesLikely;
      const cashFlowWorst = annualRent - expensesWorst;

      // Keep numbers, not strings
      bestCase.push(
        Number(((cashFlowBest / totalInvestment) * 100).toFixed(2))
      );
      likelyCase.push(
        Number(((cashFlowLikely / totalInvestment) * 100).toFixed(2))
      );
      worstCase.push(
        Number(((cashFlowWorst / totalInvestment) * 100).toFixed(2))
      );
    }

    return { bestCase, likelyCase, worstCase };
  }, [
    holdingYears,
    baseAnnualRent,
    baseAnnualExpenses,
    totalInvestment,
    opExChange,
    revenueGrowth,
  ]);

  const chartData = {
    labels: Array.from({ length: holdingYears }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: "Best Case ROI",
        data: scenarios.bestCase,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.05)",
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "Likely Case ROI",
        data: scenarios.likelyCase,
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.05)",
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "Worst Case ROI",
        data: scenarios.worstCase,
        borderColor: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.05)",
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest", // detect nearest point
      axis: "x", // along x-axis
      intersect: false, // allow hover even if not exactly on the line
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          padding: 10,
          usePointStyle: true,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "ROI Sensitivity Analysis",
        padding: { bottom: 10 },
        font: { size: 14 },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 10,
        bodySpacing: 6,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`,
        },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: {
          callback: (value) => `${value}%`,
          padding: 5,
          font: { size: 11 },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          padding: 15,
          font: { size: 10 },
        },
      },
    },
    layout: {
      padding: { top: 0, right: 5, bottom: 0, left: 5 },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          padding: "0 5px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "12px",
              color: "#555",
            }}
          >
            Operating Expenses Change: {opExChange}%
          </label>
          <input
            type="range"
            min="-20"
            max="20"
            value={opExChange}
            onChange={(e) => setOpExChange(Number(e.target.value))}
            style={{
              width: "100%",
              height: "6px",
              accentColor: "#446688",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "12px",
              color: "#555",
            }}
          >
            Revenue Growth Rate: {revenueGrowth}%
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={revenueGrowth}
            onChange={(e) => setRevenueGrowth(Number(e.target.value))}
            style={{
              width: "100%",
              height: "6px",
              accentColor: "#446688",
            }}
          />
        </div>
      </div>

      <div
        style={{
          flex: "1",
          minHeight: "300px",
          position: "relative",
          marginTop: "-5px",
        }}
      >
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SensitivityAnalysisChart;
