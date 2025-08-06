import React, { useState } from "react";
import ROIForm from "./ROIForm";
import ROIResults from "./ROIResults";
import ROIChart from "./ROIChart";
import "../../styles/ROICalculator.css";

const ROICalculatorPage = () => {
  const [results, setResults] = useState(null);

  return (
    <div className="roi-calculator-wrapper">
      <div className="roi-calculator-page">
        <header className="calculator-header">
          <h1>Real Estate ROI Calculator</h1>
          <p className="subtitle">
            Analyze your investment property's potential returns
          </p>
        </header>

        <div className="calculator-grid">
          <div className="form-container">
            <ROIForm setResults={setResults} />
          </div>

          <div className="results-container">
            {results ? (
              <>
                <ROIResults data={results} />
                <div className="chart-wrapper">
                  <ROIChart data={results} />
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
    </div>
  );
};

export default ROICalculatorPage;
