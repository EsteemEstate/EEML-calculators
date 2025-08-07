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

function ROIChart({ data }) {
  if (!data || !data.holdingPeriod || data.holdingPeriod <= 0) return null;

  const years = Array.from({ length: data.holdingPeriod }, (_, i) => i + 1);

  // Data extraction and calculations remain the same
  const price = Number(data.price) || 0;
  const appreciationRate = (Number(data.appreciationRate) || 0) / 100;
  const rentIncreaseRate = (Number(data.rentIncreaseRate) || 0) / 100;
  const monthlyRent = Number(data.rent) || 0;
  const monthlyExpenses =
    (Number(data.taxes) +
      Number(data.insurance) +
      Number(data.maintenance) +
      Number(data.propertyManagement) +
      Number(data.utilities)) /
      12 || 0;
  const monthlyMortgage = data.roi?.monthlyCashFlow
    ? Number(data.rent) - Number(data.roi.monthlyCashFlow) - monthlyExpenses
    : 0;

  const calculateProjections = () => {
    let cumulativeCashFlow = 0;
    let currentRent = monthlyRent;
    let currentValue = price;

    return years.map((year) => {
      if (year > 1) currentRent *= 1 + rentIncreaseRate;
      currentValue *= 1 + appreciationRate;
      const annualCashFlow =
        (currentRent - monthlyExpenses - monthlyMortgage) * 12;
      cumulativeCashFlow += annualCashFlow;
      const totalInvestment =
        Number(data.downPayment) + Number(data.closingCosts);
      const roi =
        totalInvestment > 0
          ? parseFloat(
              (
                ((currentValue - price + cumulativeCashFlow) /
                  totalInvestment) *
                100
              ).toFixed(2)
            )
          : 0;

      return {
        year,
        value: currentValue,
        rent: currentRent,
        cashFlow: annualCashFlow,
        cumulativeCashFlow,
        roi,
      };
    });
  };

  const projections = calculateProjections();

  const chartData = {
    labels: years.map((y) => `Year ${y}`),
    datasets: [
      {
        label: "ROI (%)",
        data: projections.map((p) => p.roi),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y1",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        datalabels: { display: false },
      },
      {
        label: "Property Value ($)",
        data: projections.map((p) => p.value),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        yAxisID: "y2",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        datalabels: { display: false },
      },
      {
        label: "Monthly Income ($)",
        data: projections.map((p) => p.rent),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        yAxisID: "y2",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        datalabels: { display: false },
      },
      {
        label: "Annual Cash Flow ($)",
        data: projections.map((p) => p.cashFlow),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.1)",
        yAxisID: "y2",
        tension: 0.3,
        borderWidth: 2,
        hidden: true,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        datalabels: { display: false },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
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
            return label.includes("ROI")
              ? `${label}: ${value.toFixed(2)}%`
              : `${label}: $${value.toFixed(0)}`;
          },
        },
      },
      title: {
        display: true,
        text: `Investment Projection Over ${data.holdingPeriod} Years`,
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
          text: "ROI (%)",
          color: "rgba(75, 192, 192, 1)",
        },
        grid: {
          drawOnChartArea: true,
          color: "rgba(75, 192, 192, 0.1)",
        },
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
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5,
        borderWidth: 1,
        backgroundColor: (context) => context.dataset.borderColor,
        borderColor: "#fff",
      },
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

export default ROIChart;
