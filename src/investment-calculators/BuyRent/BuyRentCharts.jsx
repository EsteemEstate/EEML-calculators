// src/investment-calculators/BuyRent/BuyRentCharts.jsx
import React from "react";
import "../../styles/BuyRentCalculator.css";
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
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataLabels
);

function BuyRentCharts({ data }) {
  const yearsCount = Number(data?.timeHorizonYears) || 10;

  const buyWealth = Number(data?.buyWealth) || 0;
  const rentWealth = Number(data?.rentWealth) || 0;
  const totalBuyCosts = Number(data?.totalBuyCosts) || 0;
  const totalRentCosts = Number(data?.totalRentCosts) || 0;

  const years = Array.from({ length: yearsCount }, (_, i) => i + 1);

  const buyWealthCurve = years.map((year) => (buyWealth / yearsCount) * year);
  const rentWealthCurve = years.map((year) => (rentWealth / yearsCount) * year);
  const buyCostCurve = years.map((year) => (totalBuyCosts / yearsCount) * year);
  const rentCostCurve = years.map(
    (year) => (totalRentCosts / yearsCount) * year
  );

  const netWealthDiffCurve = years.map(
    (_, i) => buyWealthCurve[i] - rentWealthCurve[i]
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, // no cents
    }).format(value);

  const wealthChartData = {
    labels: years,
    datasets: [
      {
        label: "Wealth if Buying",
        data: buyWealthCurve,
        borderColor: "blue",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.3,
      },
      {
        label: "Wealth if Renting",
        data: rentWealthCurve,
        borderColor: "purple",
        backgroundColor: "rgba(128, 0, 128, 0.2)",
        tension: 0.3,
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
        tension: 0.3,
      },
      {
        label: "Total Costs (Rent)",
        data: rentCostCurve,
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const netWealthDiffData = {
    labels: years,
    datasets: [
      {
        label: "Net Wealth Difference (Buy - Rent)",
        data: netWealthDiffCurve,
        borderColor: "green",
        backgroundColor: "rgba(0, 200, 0, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { left: 20, right: 20, top: 30, bottom: 30 } },
    plugins: {
      legend: { position: "top", labels: { usePointStyle: true, padding: 15 } },
      datalabels: {
        color: "#333",
        anchor: (context) => {
          // Top line: labels above, Bottom line: labels below
          if (context.datasetIndex === 0) return "end"; // top dataset
          if (context.datasetIndex === 1) return "start"; // bottom dataset
          return "center";
        },
        align: (context) => {
          if (context.datasetIndex === 0) return "top";
          if (context.datasetIndex === 1) return "bottom";
          return "center";
        },
        formatter: (value, context) => {
          if (value === 0) return ""; // hide zero values
          if (
            context.dataIndex === 0 ||
            context.dataIndex === years.length - 1 ||
            context.dataIndex % 3 === 0
          ) {
            return formatCurrency(value);
          }
          return "";
        },
        font: { weight: "bold", size: 10 },
        clip: false,
        padding: 6,
        offset: 8,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
          font: { size: 14, weight: "bold" },
        },
        ticks: {
          callback: (v) => formatCurrency(v),
          maxTicksLimit: 6,
          padding: 15,
        },
        grace: "15%",
      },
      x: {
        title: {
          display: true,
          text: "Years",
          font: { size: 14, weight: "bold" },
        },
        ticks: { maxTicksLimit: 10, padding: 10 },
        grace: "10%",
      },
    },
    elements: {
      line: { borderWidth: 3 },
      point: { radius: 4, hoverRadius: 6, hitRadius: 10 },
    },
    interaction: { intersect: false, mode: "index" },
  };

  const ChartCard = ({ title, chartData }) => (
    <div
      className="chart-card"
      style={{
        padding: "20px",
        width: "100%",
        maxWidth: "900px",
        height: "500px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{title}</h3>
      <Line data={chartData} options={options} />
    </div>
  );

  return (
    <div
      className="charts-container"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "50px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <ChartCard title="Wealth Over Time" chartData={wealthChartData} />
      <ChartCard
        title="Cumulative Costs Over Time"
        chartData={costsChartData}
      />
      <ChartCard
        title="Net Wealth Difference (Buy - Rent)"
        chartData={netWealthDiffData}
      />
    </div>
  );
}

export default BuyRentCharts;
