import React, { useState } from "react";
import ROIForm from "./ROIForm";
import ROIResults from "./ROIResults";
import ROIChart from "./ROIChart";
import ROIPieChart from "./ROIPieChart";
import "../../styles/ROICalculator.css";

const ROICalculatorPage = () => {
  const [results, setResults] = useState(null);

  return (
    <div className="roi-calculator-wrapper">
      <header className="calculator-header">
        <h1>EEML ROI Calculator</h1>
        <p className="subtitle">
          Analyze your investment property's potential returns
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info Column */}
        <aside className="info-column">
          <h2>What is ROI?</h2>
          <p>
            ROI (Return on Investment) measures the profitability of your
            investment, expressed as a percentage of the total investment cost.
            It’s a key metric for evaluating whether a property is worth
            pursuing.
          </p>
          <h4>Formula:</h4>
          <p>
            <strong>ROI = (Net Profit ÷ Total Investment) × 100</strong>
          </p>
          <ul>
            <li>
              <strong>Net Profit:</strong> Annual income − annual expenses
            </li>
            <li>
              <strong>Total Investment:</strong> Purchase price + acquisition
              costs − loan amount
            </li>
          </ul>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <ROIForm setResults={setResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <>
              <ROIResults data={results} />
              <div className="chart-grid">
                <div className="chart-wrapper">
                  <ROIChart data={results} />
                </div>
                <div className="chart-wrapper">
                  <ROIPieChart data={results} />
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to see your ROI analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ROICalculatorPage;
