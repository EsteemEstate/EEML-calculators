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

      bestCase.push(((cashFlowBest / totalInvestment) * 100).toFixed(2));
      likelyCase.push(((cashFlowLikely / totalInvestment) * 100).toFixed(2));
      worstCase.push(((cashFlowWorst / totalInvestment) * 100).toFixed(2));
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
        pointRadius: 0, // Hide points
        pointHoverRadius: 0, // Hide hover points
      },
      {
        label: "Likely Case ROI",
        data: scenarios.likelyCase,
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.05)",
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0, // Hide points
        pointHoverRadius: 0, // Hide hover points
      },
      {
        label: "Worst Case ROI",
        data: scenarios.worstCase,
        borderColor: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.05)",
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0, // Hide points
        pointHoverRadius: 0, // Hide hover points
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          padding: 10, // Reduced from 20
          usePointStyle: true,
          font: {
            size: 12, // Reduced label size
          },
        },
      },
      title: {
        display: true,
        text: "ROI Sensitivity Analysis",
        padding: { bottom: 10 }, // Reduced from 15
        font: { size: 14 }, // Reduced from 16
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 10, // Reduced from 12
        bodySpacing: 6, // Reduced from 8
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
        },
        bodyFont: {
          size: 12, // Reduced tooltip font size
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: {
          callback: (value) => `${value}%`,
          padding: 5,
          font: {
            size: 11, // Reduced axis label size
          },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          padding: 15,
          font: {
            size: 10, // Reduced axis label size
          },
        },
      },
    },
    layout: {
      padding: {
        top: 0, // Reduced from 5
        right: 5, // Reduced from 10
        bottom: 0, // Reduced from 5
        left: 5, // Reduced from 10
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px", // Reduced from 15px
        padding: "10px", // Reduced from 15px
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px", // Reduced from 20px
          padding: "0 5px", // Reduced from 10px
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px", // Reduced from 8px
              fontSize: "12px", // Reduced from 14px
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
              marginBottom: "5px", // Reduced from 8px
              fontSize: "12px", // Reduced from 14px
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
          marginTop: "-5px", // Added to move chart up slightly
        }}
      >
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SensitivityAnalysisChart;
