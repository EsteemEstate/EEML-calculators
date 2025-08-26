// PortfolioCharts.jsx
import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function PortfolioCharts({ type, data }) {
  if (!data) return null;

  const { properties, portfolioTimeline, currency } = data;

  const formatCurrency = (value) =>
    typeof value === "number"
      ? value.toLocaleString("en-US", {
          style: "currency",
          currency: currency || "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "N/A";

  switch (type) {
    // 1. Portfolio Value & Equity Growth
    case "portfolioValueEquity": {
      const labels = portfolioTimeline?.map((p) => p.year) || [];
      const totalValues = portfolioTimeline?.map((p) => p.totalValue) || [];
      const totalEquity = portfolioTimeline?.map((p) => p.totalEquity) || [];
      const totalDebt = portfolioTimeline?.map((p) => p.totalDebt) || [];

      return (
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Total Portfolio Value",
                data: totalValues,
                borderColor: "#1f77b4",
                backgroundColor: "rgba(31,119,180,0.1)",
                fill: false,
              },
              {
                label: "Total Equity",
                data: totalEquity,
                borderColor: "#ff7f0e",
                backgroundColor: "rgba(255,127,14,0.1)",
                fill: true,
              },
              {
                label: "Total Debt",
                data: totalDebt,
                borderColor: "#2ca02c",
                backgroundColor: "rgba(44,160,44,0.1)",
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      );
    }

    // 2. Property Type Allocation (Pie)
    case "propertyTypeAllocation": {
      const typeCounts = {};
      properties.forEach((p) => {
        typeCounts[p.type] = (typeCounts[p.type] || 0) + (p.currentValue || 0);
      });
      return (
        <Pie
          data={{
            labels: Object.keys(typeCounts),
            datasets: [
              {
                data: Object.values(typeCounts),
                backgroundColor: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"],
              },
            ],
          }}
          options={{
            plugins: {
              legend: { position: "right" },
              datalabels: { formatter: (val) => `${Math.round(val)}$` },
            },
            responsive: true,
          }}
        />
      );
    }

    // 3. Cashflow & NOI Trend (Stacked Bar)
    case "cashflowTrend": {
      const labels = portfolioTimeline?.map((p) => p.year) || [];
      return (
        <Bar
          data={{
            labels,
            datasets: properties.map((p, idx) => ({
              label: p.name,
              data:
                portfolioTimeline?.map((year) => year.cashflows[p.name]) || [],
              backgroundColor: `rgba(${(idx * 70) % 255}, ${
                (idx * 130) % 255
              }, ${(idx * 200) % 255}, 0.7)`,
            })),
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              datalabels: { display: false },
            },
            scales: { x: { stacked: true }, y: { stacked: true } },
          }}
        />
      );
    }

    // 4. Risk Sensitivity Tornado (Horizontal Bar)
    case "riskTornado": {
      const risks = data.riskSensitivity || [];
      return (
        <Bar
          data={{
            labels: risks.map((r) => r.label),
            datasets: [
              {
                label: "ΔPortfolio Equity",
                data: risks.map((r) => r.impact),
                backgroundColor: "#d62728",
              },
            ],
          }}
          options={{
            indexAxis: "y",
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } },
          }}
        />
      );
    }

    // 5. Property Contribution to Equity
    case "equityContribution": {
      const labels = properties.map((p) => p.name);
      const dataSet = properties.map((p) => p.equity || 0);
      return (
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Equity Contribution",
                data: dataSet,
                backgroundColor: labels.map(
                  (_, idx) =>
                    `rgba(${(idx * 70) % 255}, ${(idx * 130) % 255}, ${
                      (idx * 200) % 255
                    }, 0.7)`
                ),
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: formatCurrency,
              },
            },
          }}
        />
      );
    }

    default:
      return null;
  }
}

export default PortfolioCharts;
