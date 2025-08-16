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
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function OccupancyCashFlowChart({ data }) {
  if (!data || !data.monthlyRent) return null;

  const occupancyRange = Array.from({ length: 101 }, (_, i) => i); // 0% to 100%

  const monthlyExpenses = data.monthlyExpenses || 0;
  const monthlyMortgage = data.monthlyMortgage || 0;
  const monthlyRent = data.monthlyRent;

  const cashFlowData = occupancyRange.map((occ) => {
    const occupancyFactor = occ / 100;
    const effectiveRent = monthlyRent * occupancyFactor;
    const cashFlow = effectiveRent - monthlyExpenses - monthlyMortgage;
    return cashFlow;
  });

  const chartData = {
    labels: occupancyRange.map((o) => `${o}%`),
    datasets: [
      {
        label: "Monthly Cash Flow ($)",
        data: cashFlowData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        datalabels: { display: false },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`,
        },
      },
      title: {
        display: true,
        text: "Occupancy vs Monthly Cash Flow (LTR at Fixed Rent)",
        font: { size: 16 },
      },
      datalabels: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "Occupancy (%)" } },
      y: { title: { display: true, text: "Cash Flow ($)" } },
    },
  };

  return (
    <div style={{ position: "relative", height: "380px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default OccupancyCashFlowChart;
