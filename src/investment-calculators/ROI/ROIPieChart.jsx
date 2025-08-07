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

  // Filter out zero values to avoid showing empty segments
  const labels = [
    "Taxes",
    "Insurance",
    "Maintenance",
    "Property Management",
    "Utilities",
    "HOA Fees",
  ];
  const values = [
    taxes,
    insurance,
    maintenance,
    propertyManagement,
    utilities,
    hoaFees,
  ];

  // Filter out zero values
  const filteredLabels = labels.filter((_, index) => values[index] > 0);
  const filteredValues = values.filter((value) => value > 0);

  const chartData = {
    labels: filteredLabels,
    datasets: [
      {
        data: filteredValues,
        backgroundColor: [
          "#446688", // primary
          "#6699cc", // secondary
          "#ff9966", // accent
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: "#f0f4f8", // bg-color
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: "#fff",
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Operating Expense Breakdown",
        color: "#334455", // text
        font: {
          family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          size: 16,
          weight: "600",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        position: "bottom",
        labels: {
          color: "#556677", // text-light
          font: {
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            size: 12,
            weight: "500",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#446688", // primary
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: {
          size: 14,
          weight: "600",
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
      },
      datalabels: {
        formatter: (value, context) => {
          const dataset = context.chart.data.datasets[0].data;
          const total = dataset.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        color: "#fff",
        font: {
          family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          weight: "600",
          size: 12,
        },
        textAlign: "center",
        anchor: "center",
        offset: 0,
        clamp: true,
        clip: false,
        display: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value > 0; // Only display if value is greater than 0
        },
      },
    },
    cutout: "65%",
    radius: "90%",
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-container" style={{ height: "400px" }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}

export default ROIPieChart;
