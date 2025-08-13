// src/utils/formatHelpers.js

/**
 * Formats a number as a percentage with 2 decimal places
 * @param {number} value - The number to format
 * @returns {string} Formatted percentage string (e.g., "5.25%")
 */
export const formatPercent = (value) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "0.00%";
  }
  return `${value.toFixed(2)}%`;
};

/**
 * Formats a number as currency with proper localization
 * @param {number} value - The number to format
 * @param {string} [currency='USD'] - Currency code (default: USD)
 * @param {string} [locale='en-US'] - Locale code (default: en-US)
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (value, currency = "USD", locale = "en-US") => {
  if (typeof value !== "number" || isNaN(value)) {
    return "$0";
  }

  return value.toLocaleString(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formats a large number with appropriate units (e.g., k for thousands)
 * @param {number} value - The number to format
 * @returns {string} Formatted number string (e.g., "1.23k")
 */
export const formatLargeNumber = (value) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "0";
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}k`;
  }
  return value.toFixed(2);
};
