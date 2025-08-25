// src/investment-calculators/EquityGrowth/EquityGrowthCharts.jsx
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  annotationPlugin,
  ChartDataLabels
);

function EquityGrowthCharts({ type, data }) {
  const startYear = new Date().getFullYear(); // default start year

  // Convert monthly arrays to annual by taking every 12th value
  const annualEquityValues = data.equityValues
    ? data.equityValues.filter((_, i) => i % 12 === 0)
    : [];
  const annualPropertyValues = data.propertyValues
    ? data.propertyValues.filter((_, i) => i % 12 === 0)
    : [];
  const annualLoanBalances = data.loanBalances
    ? data.loanBalances.filter((_, i) => i % 12 === 0)
    : [];

  const formatCurrency = (val) =>
    typeof val === "number"
      ? val.toLocaleString("en-US", {
          style: "currency",
          currency: data.currency || "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : val;

  let chartData = {};
  let options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      datalabels: {
        display: type === "waterfall",
        color: "black",
        anchor: "end",
        align: "top",
        formatter: (value) =>
          typeof value === "number" ? formatCurrency(value) : value,
      },
      annotation: { annotations: {} },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: type === "equityTimeline" ? "Year" : "Period",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (" + (data.currency || "USD") + ")",
        },
      },
    },
  };

  switch (type) {
    case "equityTimeline":
      chartData = {
        labels: annualEquityValues.map((_, i) => `${startYear + i}`),
        datasets: [
          {
            label: "Equity Growth",
            data: annualEquityValues,
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.1)",
            tension: 0.3,
          },
          ...(data.mcPercentiles
            ? [
                {
                  label: "5th Percentile",
                  data: data.mcPercentiles.P5.filter((_, i) => i % 12 === 0),
                  borderColor: "red",
                  borderDash: [5, 5],
                  fill: false,
                },
                {
                  label: "50th Percentile (Median)",
                  data: data.mcPercentiles.P50.filter((_, i) => i % 12 === 0),
                  borderColor: "green",
                  borderDash: [5, 5],
                  fill: false,
                },
                {
                  label: "95th Percentile",
                  data: data.mcPercentiles.P95.filter((_, i) => i % 12 === 0),
                  borderColor: "orange",
                  borderDash: [5, 5],
                  fill: false,
                },
              ]
            : []),
        ],
      };

      options.plugins.annotation.annotations = {
        currentEquity: {
          type: "line",
          yMin: data.equityToday,
          yMax: data.equityToday,
          borderColor: "blue",
          borderWidth: 1,
          label: {
            enabled: true,
            content: `Current Equity: ${formatCurrency(data.equityToday)}`,
            position: "end",
            backgroundColor: "rgba(0,0,255,0.2)",
          },
        },
        horizonEquity: {
          type: "line",
          yMin: data.equityAtHorizon,
          yMax: data.equityAtHorizon,
          borderColor: "green",
          borderWidth: 1,
          label: {
            enabled: true,
            content: `Equity at Horizon: ${formatCurrency(
              data.equityAtHorizon
            )}`,
            position: "end",
            backgroundColor: "rgba(0,255,0,0.2)",
          },
        },
      };
      break;

    case "propertyLoan":
      chartData = {
        labels: annualPropertyValues.map((_, i) => `${startYear + i}`),
        datasets: [
          {
            label: "Property Value",
            data: annualPropertyValues,
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.1)",
            tension: 0.3,
          },
          {
            label: "Loan Balance",
            data: annualLoanBalances,
            borderColor: "red",
            backgroundColor: "rgba(255,0,0,0.1)",
            tension: 0.3,
          },
          {
            label: "Equity",
            data: annualEquityValues,
            borderColor: "green",
            backgroundColor: "rgba(0,255,0,0.1)",
            tension: 0.3,
          },
        ],
      };
      break;

    case "waterfall":
      chartData = {
        labels: data.equitySources?.map((e) => e.label) || [],
        datasets: [
          {
            label: "Amount",
            data: data.equitySources?.map((e) => e.amount) || [],
            backgroundColor: data.equitySources?.map((e) =>
              e.amount >= 0 ? "green" : "red"
            ),
          },
        ],
      };
      options.plugins.legend.display = false;
      options.plugins.datalabels.display = true;
      break;

    default:
      return <div>No chart type selected.</div>;
  }

  return type === "waterfall" ? (
    <Bar data={chartData} options={options} />
  ) : (
    <Line data={chartData} options={options} />
  );
}

export default EquityGrowthCharts;
