import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

function ROIPieChart({ data }) {
  const {
    taxes,
    insurance,
    maintenance,
    propertyManagement,
    utilities,
    hoaFees,
  } = data;

  // Convert all values to numbers and filter zeros
  const labels = [
    "Taxes",
    "Insurance",
    "Maintenance",
    "Property Management",
    "Utilities",
    "HOA Fees",
  ];
  const values = [
    Number(taxes || 0),
    Number(insurance || 0),
    Number(maintenance || 0),
    Number(propertyManagement || 0),
    Number(utilities || 0),
    Number(hoaFees || 0), // Ensure HOA fees is included
  ];

  // Filter out zero values but keep very small values
  const filteredLabels = labels.filter((_, index) => values[index] > 0);
  const filteredValues = values.filter((value) => value > 0);

  const chartData = {
    labels: filteredLabels,
    datasets: [
      {
        data: filteredValues,
        backgroundColor: [
          "#446688",
          "#6699cc",
          "#ff9966",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: "#f0f4f8",
        borderWidth: 1,
        hoverBorderWidth: 2,
        hoverBorderColor: "#fff",
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Operating Expense Breakdown",
        color: "#334455",
        font: {
          size: 16,
          weight: "600",
        },
        padding: {
          top: 5,
          bottom: 10,
        },
      },
      legend: {
        position: "bottom",
        labels: {
          color: "#556677",
          font: {
            size: 12,
            weight: "500",
          },
          padding: 10,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: "#446688",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 8,
      },
      datalabels: {
        formatter: (value, context) => {
          const dataset = context.chart.data.datasets[0].data;
          const total = dataset.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`; // Always show percentage regardless of size
        },
        color: "#fff",
        font: {
          weight: "600",
          size: 11, // Slightly larger font
        },
        offset: 6, // Increased offset for better visibility
        display: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value > 0;
        },
      },
    },
    cutout: "65%",
    radius: "85%",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
  };

  return (
    // In ROIPieChart.js
    <div
      style={{
        position: "relative",
        height: "360px",
        width: "100%",
        marginTop: "30px", // Increased from 0.5rem
        marginBottom: "-0.5rem",
      }}
    >
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default ROIPieChart;
