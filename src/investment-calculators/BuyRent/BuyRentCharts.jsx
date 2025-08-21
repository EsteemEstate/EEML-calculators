// src/investment-calculators/BuyRent/BuyRentCharts.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function BuyRentCharts({ data }) {
  if (!data) return null;

  // Build time axis (years)
  const years = Array.from({ length: data.timeHorizonYears }, (_, i) => i + 1);

  // Generate approximate wealth curves for chart
  const buyWealthCurve = years.map((year) => {
    const annualGrowth = (data.buyWealth / data.timeHorizonYears) * year;
    return annualGrowth;
  });

  const rentWealthCurve = years.map((year) => {
    const annualGrowth = (data.rentWealth / data.timeHorizonYears) * year;
    return annualGrowth;
  });

  // Costs over time
  const totalBuyCostsPerYear = data.totalBuyCosts / data.timeHorizonYears;
  const totalRentCostsPerYear = data.totalRentCosts / data.timeHorizonYears;

  const buyCostCurve = years.map((year) => totalBuyCostsPerYear * year);
  const rentCostCurve = years.map((year) => totalRentCostsPerYear * year);

  const wealthChartData = {
    labels: years,
    datasets: [
      {
        label: "Wealth if Buying",
        data: buyWealthCurve,
        borderColor: "blue",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
      },
      {
        label: "Wealth if Renting",
        data: rentWealthCurve,
        borderColor: "purple",
        backgroundColor: "rgba(128, 0, 128, 0.2)",
      },
    ],
  };

  const costsChartData = {
    labels: years,
    datasets: [
      {
        label: "Total Costs (Buy)",
        data: buyCostCurve,
        borderColor: "red",
        backgroundColor: "rgba(220, 53, 69, 0.2)",
      },
      {
        label: "Total Costs (Rent)",
        data: rentCostCurve,
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Financial Comparison Over Time" },
    },
    scales: {
      y: { beginAtZero: true },
      x: { title: { display: true, text: "Years" } },
    },
  };

  return (
    <div className="charts-container space-y-6">
      <div className="chart p-4 bg-white rounded shadow">
        <h4 className="text-sm font-semibold mb-2">Wealth Over Time</h4>
        <Line data={wealthChartData} options={options} />
      </div>
      <div className="chart p-4 bg-white rounded shadow">
        <h4 className="text-sm font-semibold mb-2">
          Cumulative Costs Over Time
        </h4>
        <Line data={costsChartData} options={options} />
      </div>
    </div>
  );
}

export default BuyRentCharts;
