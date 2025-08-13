export const formatPercent = (value) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "0.00%";

export const formatCurrency = (value) =>
  typeof value === "number"
    ? value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    : "$0";
