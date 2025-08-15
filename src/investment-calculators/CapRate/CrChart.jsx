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

function CrChart({ data }) {
  if (!data || !data.holdingPeriod || data.holdingPeriod <= 0) return null;

  const years = Array.from({ length: data.holdingPeriod }, (_, i) => i + 1);

  // Base values
  const price = Number(data.price) || 0;
  const rentGrowthRate = (Number(data.rentGrowthRate) || 0) / 100;
  const expenseGrowthRate = (Number(data.expenseGrowthRate) || 0) / 100;
  const vacancyRate = (Number(data.vacancyRate) || 0) / 100;

  const annualRent = (Number(data.rent) || 0) * 12;
  const otherIncomeTotal =
    (Number(data.parkingIncome) || 0) +
    (Number(data.storageIncome) || 0) +
    (Number(data.laundryIncome) || 0) +
    (Number(data.advertisingIncome) || 0) +
    (Number(data.serviceFeesIncome) || 0) +
    (Number(data.eventRentalsIncome) || 0);

  const baseOperatingExpenses =
    (Number(data.taxes) || 0) +
    (Number(data.insurance) || 0) +
    (Number(data.maintenance) || 0) +
    (Number(data.propertyManagement) || 0) +
    (Number(data.utilities) || 0) +
    (Number(data.hoaFees) || 0) +
    (Number(data.otherExpenses) || 0);

  const calculateYearlyCapRates = () => {
    return years.map((year) => {
      const adjustedRent = annualRent * Math.pow(1 + rentGrowthRate, year - 1);
      const adjustedOtherIncome =
        otherIncomeTotal * Math.pow(1 + rentGrowthRate, year - 1); // Assuming same growth as rent
      const adjustedExpenses =
        baseOperatingExpenses * Math.pow(1 + expenseGrowthRate, year - 1);

      const grossScheduledIncome = adjustedRent + adjustedOtherIncome;
      const vacancyLoss = grossScheduledIncome * vacancyRate;
      const effectiveGrossIncome = grossScheduledIncome - vacancyLoss;
      const NOI = effectiveGrossIncome - adjustedExpenses;

      const capRate = price > 0 ? (NOI / price) * 100 : 0;

      return { year, NOI, capRate };
    });
  };

  const projections = calculateYearlyCapRates();

  const chartData = {
    labels: years.map((y) => `Year ${y}`),
    datasets: [
      {
        label: "Cap Rate (%)",
        data: projections.map((p) => p.capRate),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y1",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        datalabels: { display: false },
      },
      {
        label: "NOI ($)",
        data: projections.map((p) => p.NOI),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        yAxisID: "y2",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        datalabels: { display: false },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        onClick: (e, legendItem, legend) => {
          if (legendItem.datasetIndex === 0) return;
          legend.chart.getDatasetMeta(legendItem.datasetIndex).hidden =
            !legend.chart.getDatasetMeta(legendItem.datasetIndex).hidden;
          legend.chart.update();
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return label.includes("Cap Rate")
              ? `${label}: ${value.toFixed(2)}%`
              : `${label}: $${value.toFixed(0)}`;
          },
        },
      },
      title: {
        display: true,
        text: `Cap Rate Projection Over ${data.holdingPeriod} Years`,
        font: { size: 16 },
      },
      datalabels: { display: false },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Cap Rate (%)",
          color: "rgba(75, 192, 192, 1)",
        },
        grid: { drawOnChartArea: true, color: "rgba(75, 192, 192, 0.1)" },
        ticks: {
          color: "rgba(75, 192, 192, 1)",
          callback: (value) => value.toFixed(2) + "%",
        },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Dollars ($)",
          color: "rgba(54, 162, 235, 1)",
        },
        grid: { drawOnChartArea: false },
        ticks: { color: "rgba(54, 162, 235, 1)" },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        position: "relative",
        height: "400px",
        width: "100%",
      }}
    >
      <Line data={chartData} options={options} />
    </div>
  );
}

export default CrChart;
