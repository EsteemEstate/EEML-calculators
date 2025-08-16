import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function BreakEvenChart({ data }) {
  if (!data) return null;

  const { breakEvenRevenue, totalOperatingExpenses, mortgagePayment } = data;

  const fixedCosts =
    (totalOperatingExpenses?.total || totalOperatingExpenses || 0) +
    (mortgagePayment?.regularPayment || mortgagePayment || 0);

  const revenueRange = Array.from(
    { length: 21 },
    (_, i) => i * (breakEvenRevenue * 0.1)
  );

  const revenueLine = revenueRange.map((rev) => rev);
  const costLine = revenueRange.map(() => fixedCosts);

  const chartData = {
    labels: revenueRange,
    datasets: [
      {
        label: "Total Revenue",
        data: revenueLine,
        borderColor: "green",
        borderWidth: 3,
        fill: "+1",
        backgroundColor: "rgba(0,200,0,0.1)",
        tension: 0.2,
        pointRadius: 3,
      },
      {
        label: "Total Costs",
        data: costLine,
        borderColor: "red",
        borderWidth: 3,
        fill: "-1",
        backgroundColor: "rgba(200,0,0,0.1)",
        tension: 0.2,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) => `$${ctx.raw.toLocaleString()}`,
        },
      },
      legend: {
        position: "bottom",
        labels: { font: { size: 14 } },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Monthly Rent Revenue ($)",
          font: { size: 16 },
        },
        ticks: {
          font: { size: 12 },
          callback: (value, index) => {
            // show every 3rd tick only
            if (index % 3 === 0) {
              const v = revenueRange[index];
              return `$${(v / 1000).toFixed(0)}k`;
            }
            return "";
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Costs & Revenue ($)",
          font: { size: 16 },
        },
        ticks: {
          font: { size: 12 },
          callback: (value) => `$${(value / 1000).toFixed(0)}k`,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      className="break-even-chart"
      style={{ width: "100%", height: "450px", margin: "0 auto" }}
    >
      <Line data={chartData} options={options} />
    </div>
  );
}

export default BreakEvenChart;
