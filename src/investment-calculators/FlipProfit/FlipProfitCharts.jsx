// FlipProfitCharts.jsx
import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(...registerables, ChartDataLabels);

const FlipProfitCharts = ({ data }) => {
  const formatCurrency = (value) =>
    value != null
      ? `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`
      : "$0.00";

  const formatPercent = (value) => {
    if (typeof value !== "number") return "0.00%";
    return `${value.toFixed(2)}%`;
  };

  // Chart 1: Financial Metrics Bar Chart
  const metricsData = {
    labels: ["Net Profit", "Total Cost", "Cash Invested"],
    datasets: [
      {
        label: "Amount ($)",
        data: [data.netProfit, data.totalProjectCost, data.totalCashInvested],
        backgroundColor: [
          data.netProfit > 0
            ? "rgba(75, 192, 192, 0.7)"
            : "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: Cost Breakdown Pie Chart
  const costBreakdownData = {
    labels: ["Purchase", "Rehab", "Fees", "Holding", "Interest"],
    datasets: [
      {
        data: [
          data.costBreakdown?.purchasePrice,
          data.costBreakdown?.rehabCost,
          data.costBreakdown?.upfrontCosts,
          data.costBreakdown?.holdingCosts,
          data.costBreakdown?.loanDetails?.interestPaid,
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // Chart 3: ROI Comparison Line Chart
  const roiComparisonData = {
    labels: ["Cash ROI", "Annualized ROI", "ARV Margin"],
    datasets: [
      {
        label: "Return Percentage",
        data: [
          data.roi,
          data.annualizedRoi,
          ((data.arv - data.totalProjectCost) / data.arv) * 100,
        ],
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  return (
    <div
      className="charts-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        marginTop: "20px",
      }}
    >
      {/* Financial Metrics */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Financial Metrics ($)</h3>
        <div style={{ height: "300px" }}>
          <Bar
            data={metricsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (ctx) => formatCurrency(ctx.raw),
                  },
                },
                datalabels: {
                  anchor: "end",
                  align: "top",
                  formatter: (value) => `$${value.toFixed(2)}`,
                  color: "#333",
                  font: { weight: "bold" },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { callback: (v) => formatCurrency(v) },
                },
              },
            }}
          />
        </div>
      </div>

      {/* ROI Comparison */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Return Metrics (%)</h3>
        <div style={{ height: "300px" }}>
          <Line
            data={roiComparisonData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: { label: (ctx) => formatPercent(ctx.raw) },
                },
                datalabels: {
                  anchor: "end",
                  align: "top",
                  formatter: (value) => `${value.toFixed(2)}%`,
                  color: "#333",
                  font: { weight: "bold" },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { callback: (v) => formatPercent(v) },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Cost Breakdown */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Cost Breakdown</h3>
        <div style={{ height: "300px" }}>
          <Pie
            data={costBreakdownData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "right" },
                tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      const dataset = ctx.dataset.data;
                      const total = dataset.reduce((sum, val) => sum + val, 0);
                      const percent = total ? (ctx.raw / total) * 100 : 0;
                      return `${ctx.label}: ${formatCurrency(
                        parseFloat(ctx.raw.toFixed(2))
                      )} (${formatPercent(percent)})`;
                    },
                  },
                },
                datalabels: {
                  color: "#fff",
                  font: { weight: "bold" },
                  formatter: (value, ctx) => {
                    const dataset = ctx.chart.data.datasets[0].data;
                    const total = dataset.reduce((sum, val) => sum + val, 0);
                    const percent = total ? (value / total) * 100 : 0;
                    // Hide labels for slices smaller than 5%
                    return percent > 5 ? `${percent.toFixed(2)}%` : "";
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FlipProfitCharts;
