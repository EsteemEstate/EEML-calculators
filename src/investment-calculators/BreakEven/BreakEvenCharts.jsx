// BreakEvenCharts.jsx
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(...registerables, ChartDataLabels);

const BreakEvenCharts = ({ data }) => {
  // Check if chartData exists
  if (!data || !data.chartData) {
    return <div>Loading chart data...</div>;
  }

  const {
    quantityRange,
    revenueData,
    costData,
    profitLossData,
    marginOfSafetyData,
  } = data.chartData;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercent = (value) =>
    typeof value === "number" ? `${value.toFixed(2)}%` : "0.00%"; // Changed to 2 decimal places

  // Classic Break-Even Chart Data
  const breakEvenData = {
    labels: quantityRange.map((qty) => qty.toString()),
    datasets: [
      {
        label: "Total Revenue",
        data: revenueData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Total Costs",
        data: costData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Break-Even Point",
        data: [
          {
            x: data.chartData.breakEvenPoint.x,
            y: data.chartData.breakEvenPoint.y,
          },
        ],
        backgroundColor: "rgba(255, 205, 86, 1)",
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
        type: "scatter",
      },
    ],
  };

  // Profit/Loss vs. Quantity Chart Data
  const profitLossChartData = {
    labels: quantityRange.map((qty) => qty.toString()),
    datasets: [
      {
        label: "Profit/Loss",
        data: profitLossData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(255, 99, 132, 0.5)"); // Red at bottom
          gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)"); // White in middle
          gradient.addColorStop(1, "rgba(75, 192, 192, 0.5)"); // Green at top
          return gradient;
        },
        fill: true,
        tension: 0.1,
      },
    ],
  };

  // Margin of Safety Chart Data
  const marginOfSafetyChartData = {
    labels: quantityRange.map((qty) => qty.toString()),
    datasets: [
      {
        label: "Margin of Safety (%)",
        data: marginOfSafetyData,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      className="charts-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        marginTop: "30px",
      }}
    >
      {/* Classic Break-Even Chart */}
      <div
        className="chart-card"
        style={{
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h3>Classic Break-Even Chart</h3>
        <div style={{ height: "300px" }}>
          <Line
            data={breakEvenData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.dataset.label}: ${formatCurrency(
                        context.raw
                      )}`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => formatCurrency(value),
                  },
                  title: { display: true, text: "Amount ($)" },
                },
                x: {
                  title: { display: true, text: "Quantity (Units)" },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Profit/Loss vs. Quantity Chart */}
      <div
        className="chart-card"
        style={{
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h3>Profit/Loss vs. Quantity</h3>
        <div style={{ height: "300px" }}>
          // Profit/Loss vs. Quantity Chart
          <Line
            data={profitLossChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  top: 30,
                  right: 15,
                  bottom: 10,
                  left: 15,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => `${formatCurrency(context.raw)}`,
                  },
                },
                datalabels: {
                  color: "#333",
                  anchor: "end",
                  align: "top",
                  formatter: (value) =>
                    value === 0 ? null : formatCurrency(value), // 👈 hide zeros
                  font: {
                    weight: "bold",
                    size: 12,
                  },
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => formatCurrency(value),
                  },
                  title: { display: true, text: "Profit / Loss ($)" },
                },
                x: {
                  title: { display: true, text: "Quantity (Units)" },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Margin of Safety Chart */}
      <div
        className="chart-card"
        style={{
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h3>Margin of Safety</h3>
        <div style={{ height: "300px" }}>
          // Margin of Safety Chart
          <Bar
            data={marginOfSafetyChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => formatPercent(context.raw),
                  },
                },
                datalabels: {
                  color: "#333",
                  anchor: "end",
                  align: "top",
                  formatter: (value) =>
                    value === 0 ? null : `${value.toFixed(2)}%`, // 👈 hide zeros
                  font: {
                    weight: "bold",
                    size: 12,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `${value.toFixed(2)}%`,
                  },
                  title: { display: true, text: "Margin of Safety (%)" },
                },
                x: {
                  title: { display: true, text: "Quantity (Units)" },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BreakEvenCharts;
