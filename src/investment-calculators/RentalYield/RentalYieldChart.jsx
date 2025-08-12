const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) label += ": ";
          if (context.parsed.y !== null) {
            if (context.label.includes("%")) {
              label += `${context.parsed.y.toFixed(2)}%`;
            } else {
              label += `$${context.parsed.y.toLocaleString()}`;
            }
          }
          return label;
        },
      },
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "Percentage (%)",
      },
      beginAtZero: true,
      // Only apply to percentage values
      ticks: {
        callback: function (value) {
          return value + "%";
        },
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        text: "Dollars ($)",
      },
      beginAtZero: true,
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
      // Only apply to cash flow
      ticks: {
        callback: function (value) {
          return "$" + value.toLocaleString();
        },
      },
    },
  },
};

// Update your dataset to specify which axis each metric uses
const chartData = {
  labels: [
    "Gross Yield (%)",
    "Net Yield (%)",
    "Cap Rate (%)",
    "Cash-on-Cash (%)",
    "Cash Flow ($)",
  ],
  datasets: [
    {
      label: "Percentage Metrics",
      data: [
        data.grossYield,
        data.netYield,
        data.capRate,
        data.cashOnCash,
        null,
      ], // null for cash flow
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      yAxisID: "y", // Use left axis
    },
    {
      label: "Cash Flow",
      data: [null, null, null, null, data.cashFlow], // only cash flow has value
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
      yAxisID: "y1", // Use right axis
    },
  ],
};
