// src/investment-calculators/Mortgage/MortgageCharts.jsx
import React from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const MortgageCharts = ({ data }) => {
  if (!data) return null;

  const {
    amortizationSchedule = [],
    monthlyPrincipalAndInterest = 0,
    monthlyTaxes = 0,
    monthlyInsurance = 0,
    monthlyHOA = 0,
    monthlyPMI = 0,
  } = data;

  // Use first month of amortization to get interest portion
  const firstMonth = amortizationSchedule[0] || {};
  const firstPrincipal =
    firstMonth.principalPayment || monthlyPrincipalAndInterest;
  const firstInterest = firstMonth.interestPayment || 0;

  // Convert monthly amortization to yearly schedule for charts
  const yearlySchedule = [];
  for (let i = 0; i < amortizationSchedule.length; i += 12) {
    const item = amortizationSchedule[i];
    yearlySchedule.push({
      year: i / 12 + 1,
      cumulativePrincipal: item.cumulativePrincipal,
      cumulativeInterest: item.cumulativeInterest,
      remainingBalance: item.remainingBalance,
    });
  }

  // Pie chart: Monthly Payment Breakdown
  const pieData = {
    labels: ["Principal", "Interest", "Taxes", "Insurance", "HOA", "PMI"],
    datasets: [
      {
        data: [
          firstPrincipal,
          firstInterest,
          monthlyTaxes,
          monthlyInsurance,
          monthlyHOA,
          monthlyPMI,
        ],
        backgroundColor: [
          "#4CAF50", // Principal
          "#F44336", // Interest
          "#2196F3", // Taxes
          "#FFC107", // Insurance
          "#9C27B0", // HOA
          "#FF9800", // PMI
        ].filter(
          (_, index) =>
            [
              firstPrincipal,
              firstInterest,
              monthlyTaxes,
              monthlyInsurance,
              monthlyHOA,
              monthlyPMI,
            ][index] > 0
        ), // remove colors for zero items
      },
    ],
  };

  // Line chart: Cumulative Principal vs Interest
  const lineDataPrincipalInterest = {
    labels: yearlySchedule.map((item) => `Year ${item.year}`),
    datasets: [
      {
        label: "Cumulative Principal Paid",
        data: yearlySchedule.map((item) => item.cumulativePrincipal),
        borderColor: "#4CAF50",
        fill: false,
      },
      {
        label: "Cumulative Interest Paid",
        data: yearlySchedule.map((item) => item.cumulativeInterest),
        borderColor: "#F44336",
        fill: false,
      },
    ],
  };

  // Line chart: Remaining Balance Over Time
  const lineDataBalance = {
    labels: yearlySchedule.map((item) => `Year ${item.year}`),
    datasets: [
      {
        label: "Remaining Balance",
        data: yearlySchedule.map((item) => item.remainingBalance),
        borderColor: "#2196F3",
        fill: false,
      },
    ],
  };

  return (
    <div className="mortgage-charts">
      <div className="chart-container">
        <h3>Monthly Payment Breakdown</h3>
        <Pie data={pieData} />
      </div>

      <div className="chart-container">
        <h3>Principal vs Interest Paid Over Time</h3>
        <Line data={lineDataPrincipalInterest} />
      </div>

      <div className="chart-container">
        <h3>Remaining Balance Over Time</h3>
        <Line data={lineDataBalance} />
      </div>
    </div>
  );
};

export default MortgageCharts;
