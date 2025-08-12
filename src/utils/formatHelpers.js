export const formatPercent = (value) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "N/A";

export const formatCurrency = (value) =>
  typeof value === "number"
    ? value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : "N/A";
