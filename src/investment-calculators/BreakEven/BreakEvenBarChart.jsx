import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function BreakEvenBarChart({ data }) {
  if (!data) return null;

  // Example monthly breakdown
  const months = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);

  // Revenue data
  const rentalIncome = months.map(() => data.monthlyRent || 0);
  const otherIncome = months.map(() => data.otherIncome || 0);

  // Expenses data (fixed + variable)
  const propertyTax = months.map(() => data.propertyTax || 0);
  const insurance = months.map(() => data.insurance || 0);
  const maintenance = months.map(() => data.maintenance || 0);
  const managementFee = months.map(() => data.managementFee || 0);
  const utilities = months.map(() => data.utilities || 0);
  const totalExpenses = months.map(
    (_, idx) =>
      propertyTax[idx] +
      insurance[idx] +
      maintenance[idx] +
      managementFee[idx] +
      utilities[idx]
  );

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Rental Income",
        data: rentalIncome,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        stack: "Revenue",
      },
      {
        label: "Other Income",
        data: otherIncome,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        stack: "Revenue",
      },
      {
        label: "Expenses",
        data: totalExpenses,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        stack: "Cost",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Revenue vs Cost (LTR) – Stacked Monthly",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`,
        },
      },
      datalabels: { display: false },
    },
    scales: {
      x: { stacked: true, title: { display: true, text: "Month" } },
      y: { stacked: true, title: { display: true, text: "Amount ($)" } },
    },
  };

  return (
    <div style={{ position: "relative", height: "380px", width: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default BreakEvenBarChart;
