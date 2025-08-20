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
    typeof value === "number" ? `${value.toFixed(2)}%` : "0.00%";

  // Classic Break-Even Chart Data - FIXED VERSION
  const breakEvenData = {
    datasets: [
      {
        label: "Total Revenue",
        data: quantityRange.map((q, i) => ({ x: q, y: revenueData[i] })),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.4,
        datalabels: {
          color: "rgba(75, 192, 192, 1)",
          anchor: "end",
          align: "top",
          formatter: (value) =>
            value.y === 0 ? null : formatCurrency(value.y),
          font: {
            weight: "bold",
            size: 10,
          },
          display: (context) => {
            return context.dataIndex % 3 === 0 ? "auto" : false;
          },
        },
      },
      {
        label: "Total Costs",
        data: quantityRange.map((q, i) => ({ x: q, y: costData[i] })),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.4,
        datalabels: {
          color: "rgba(255, 99, 132, 1)",
          anchor: "start",
          align: "bottom",
          formatter: (value) =>
            value.y === 0 ? null : formatCurrency(value.y),
          font: {
            weight: "bold",
            size: 10,
          },
          display: (context) => {
            return context.dataIndex % 3 === 0 ? "auto" : false;
          },
        },
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
        datalabels: {
          color: "rgba(255, 140, 0, 1)",
          anchor: "center",
          align: "bottom",
          formatter: () => "Break-Even",
          font: {
            weight: "bold",
            size: 11,
          },
          padding: {
            top: 10,
          },
        },
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
          gradient.addColorStop(0, "rgba(255, 99, 132, 0.5)");
          gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
          gradient.addColorStop(1, "rgba(75, 192, 192, 0.5)");
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
        <h3
          style={{ marginBottom: "20px", color: "#2c3e50", fontSize: "1.2rem" }}
        >
          Classic Break-Even Chart
        </h3>
        <div style={{ height: "350px" }}>
          <Line
            data={breakEvenData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  top: 40,
                  right: 20,
                  bottom: 20,
                  left: 20,
                },
              },
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    boxWidth: 15,
                    padding: 15,
                    font: {
                      size: 12,
                      weight: "bold",
                    },
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  padding: 12,
                  titleFont: {
                    size: 13,
                    weight: "bold",
                  },
                  bodyFont: {
                    size: 13,
                  },
                  callbacks: {
                    label: (context) => {
                      if (context.dataset.label === "Break-Even Point") {
                        return `Break-Even: ${formatCurrency(
                          context.raw.y
                        )} at ${Math.round(context.raw.x)} units`;
                      }
                      return `${context.dataset.label}: ${formatCurrency(
                        context.raw.y
                      )}`;
                    },
                    title: (context) => {
                      if (context[0].dataset.label === "Break-Even Point") {
                        return `Break-Even Point`;
                      }
                      return `Quantity: ${Math.round(context[0].raw.x)} units`;
                    },
                  },
                },
                datalabels: {
                  color: "#333",
                  font: {
                    weight: "bold",
                    size: 10,
                  },
                  padding: 4,
                  textAlign: "center",
                  clip: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                    drawBorder: false,
                  },
                  ticks: {
                    callback: (value) => formatCurrency(value),
                    font: {
                      size: 11,
                    },
                    padding: 8,
                    maxTicksLimit: 8,
                  },
                  title: {
                    display: true,
                    text: "Amount ($)",
                    font: {
                      size: 12,
                      weight: "bold",
                    },
                    padding: { bottom: 10 },
                  },
                },
                x: {
                  type: "linear", // CRITICAL: Change to linear scale for proper scatter positioning
                  grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                    drawBorder: false,
                  },
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    maxRotation: 0,
                    font: {
                      size: 11,
                    },
                    padding: 8,
                    callback: function (value) {
                      return Math.round(value); // Show rounded values for x-axis
                    },
                  },
                  title: {
                    display: true,
                    text: "Quantity (Units)",
                    font: {
                      size: 12,
                      weight: "bold",
                    },
                    padding: { top: 10 },
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                  borderWidth: 2.5,
                },
                point: {
                  radius: 3,
                  hoverRadius: 6,
                  borderWidth: 2,
                },
              },
              interaction: {
                intersect: false,
                mode: "index",
              },
            }}
          />
        </div>
        {data.chartData.breakEvenPoint &&
          data.chartData.breakEvenPoint.x > 0 && (
            <div
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                backgroundColor: "#fff3cd",
                border: "1px solid #ffeaa7",
                borderRadius: "4px",
                fontSize: "12px",
                color: "#856404",
              }}
            >
              <strong>Break-even:</strong>{" "}
              {Math.round(data.chartData.breakEvenPoint.x)} units at{" "}
              {formatCurrency(data.chartData.breakEvenPoint.y)}
            </div>
          )}
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
                    value === 0 ? null : formatCurrency(value),
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
                    value === 0 ? null : `${value.toFixed(2)}%`,
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
