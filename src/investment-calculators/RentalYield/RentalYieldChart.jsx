import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
);

const RentalYieldChart = ({ data }) => {
  if (!data) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null) {
              if (context.label.includes("%")) {
                label += `${context.parsed.y.toFixed(2)}%`;
              } else {
                label += `$${context.parsed.y.toLocaleString()}`;
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Percentage (%)",
        },
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Dollars ($)",
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  const chartData = {
    labels: [
      "Gross Yield",
      "Net Yield",
      "Cap Rate",
      "Cash-on-Cash",
      "Cash Flow",
    ],
    datasets: [
      {
        label: "Percentage Metrics",
        data: [
          data.grossYield || 0,
          data.netYield || 0,
          data.capRate || 0,
          data.cashOnCash || 0,
          null,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        label: "Cash Flow ($)",
        data: [null, null, null, null, data.cashFlow || 0],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  };

  return (
    <div className="chart-container" style={{ height: "400px", width: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RentalYieldChart;
