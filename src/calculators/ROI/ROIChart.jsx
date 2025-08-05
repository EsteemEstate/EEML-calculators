import React from "react";
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ROIChart({ results }) {
  if (!results || results.holdingPeriod <= 0) return null;

  const annualAppreciationRateDecimal = results.appreciationRate / 100;
  const netAnnualIncome = (results.rent - results.expenses) * 12;

  const projectedData = Array.from(
    { length: results.holdingPeriod },
    (_, i) => {
      const currentYear = i + 1;
      // Property value at the end of the current year
      const currentPropertyValue =
        results.price *
        Math.pow(1 + annualAppreciationRateDecimal, currentYear);
      const currentCapitalGain = currentPropertyValue - results.price;

      // Cumulative rental income up to the current year
      const currentTotalRentalIncome = netAnnualIncome * currentYear;

      // Total return up to the current year
      const currentTotalReturn = currentCapitalGain + currentTotalRentalIncome;

      // ROI for the current year
      return (currentTotalReturn / results.price) * 100;
    }
  );

  const data = {
    labels: Array.from(
      { length: results.holdingPeriod },
      (_, i) => `Year ${i + 1}`
    ),
    datasets: [
      {
        label: "Projected ROI Over Time (%)",
        data: projectedData,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)", // Added for better visual
        fill: false, // Set to true if you want area under the line filled
        tension: 0.1, // Adds a slight curve to the line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Projected ROI Over Holding Period",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "ROI (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Year",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default ROIChart;
