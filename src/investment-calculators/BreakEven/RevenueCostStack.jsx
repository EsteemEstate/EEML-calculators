import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueCostStack = ({ formData }) => {
  let revenue, variableCosts, fixedCosts;

  if (formData.propertyType === "STR") {
    const occupiedNights =
      formData.occupiedNights || (30 * formData.occupancyRate) / 100;
    revenue = occupiedNights * formData.nightlyRate;
    const channelFees = revenue * (formData.channelFeePercent / 100);
    const bookingCosts =
      occupiedNights *
      (formData.cleaningFee +
        formData.linenCost +
        formData.turnoverCost +
        formData.upsells);
    variableCosts = channelFees + bookingCosts;
    fixedCosts =
      formData.propertyTax / 12 +
      formData.insurance / 12 +
      formData.hoaFee +
      formData.utilitiesWater +
      formData.utilitiesElectric +
      formData.utilitiesInternet +
      formData.utilitiesGas +
      formData.adminCosts;
  } else {
    revenue = formData.monthlyRent + (formData.otherIncome || 0);
    const variablePercent =
      formData.managementFeePercent +
      formData.maintenanceReservePercent +
      formData.capexReservePercent +
      formData.vacancyPercent;
    variableCosts = revenue * (variablePercent / 100);
    fixedCosts =
      formData.propertyTax / 12 +
      formData.insurance / 12 +
      formData.hoaFee +
      formData.utilitiesWater +
      formData.utilitiesElectric +
      formData.utilitiesInternet +
      formData.utilitiesGas +
      formData.adminCosts;
  }

  const mortgagePayment =
    formData.mortgagePayment?.regularPayment || formData.mortgagePayment;

  const chartData = {
    labels: ["Monthly Amount"],
    datasets: [
      {
        label: "Revenue",
        data: [revenue],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Variable Costs",
        data: [variableCosts],
        backgroundColor: "rgba(255, 159, 64, 0.7)",
      },
      {
        label: "Fixed Costs",
        data: [fixedCosts],
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
      {
        label: "Mortgage",
        data: [mortgagePayment],
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Revenue vs Cost Stack",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default RevenueCostStack;
