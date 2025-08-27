// src/investment-calculators/Renovation/ReturnOnRenovationCharts.jsx
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function ReturnOnRenovationCharts({ data }) {
  if (!data) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(val || 0);

  // ROI Comparison Chart
  const roiChartData = {
    labels: ["ROI (%)"],
    datasets: [
      {
        label: "Return on Investment",
        data: [data.roiPercent],
        backgroundColor: data.roiPercent >= 0 ? "#4caf50" : "#f44336",
      },
    ],
  };

  // Cost vs Value Chart
  const costValueData = {
    labels: ["Investment", "Value Added"],
    datasets: [
      {
        label: "Amount ($)",
        data: [data.renovationCost, data.valueIncrease],
        backgroundColor: ["#ff9800", "#4caf50"],
      },
    ],
  };

  // Breakdown Pie Chart (if breakdown exists)
  const breakdownData =
    data.breakdown && data.breakdown.length > 0
      ? {
          labels: data.breakdown.map((item) => item.label || "Item"),
          datasets: [
            {
              data: data.breakdown.map((item) => item.amount),
              backgroundColor: [
                "#f44336",
                "#e91e63",
                "#9c27b0",
                "#673ab7",
                "#3f51b5",
                "#2196f3",
                "#03a9f4",
                "#00bcd4",
                "#009688",
                "#4caf50",
                "#8bc34a",
                "#cddc39",
                "#ffeb3b",
                "#ffc107",
                "#ff9800",
              ],
            },
          ],
        }
      : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return context.dataset.label === "ROI (%)"
              ? `${value.toFixed(1)}%`
              : formatCurrency(value);
          },
        },
      },
    },
  };

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <h4>Return on Investment</h4>
        <Bar data={roiChartData} options={chartOptions} height={300} />
      </div>

      <div className="chart-wrapper">
        <h4>Cost vs Value Added</h4>
        <Bar data={costValueData} options={chartOptions} height={300} />
      </div>

      {breakdownData && (
        <div className="chart-wrapper">
          <h4>Cost Breakdown</h4>
          <Pie data={breakdownData} options={chartOptions} height={300} />
        </div>
      )}
    </div>
  );
}

export default ReturnOnRenovationCharts;
