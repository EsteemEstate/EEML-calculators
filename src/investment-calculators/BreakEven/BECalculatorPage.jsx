import React, { useState } from "react";
import BreakEvenForm from "./BreakEvenForm";
import BreakEvenResults from "./BreakEvenResults";
import BreakEvenChart from "./BreakEvenChart";
import BreakEvenOccupancy from "./BreakEvenOccupancy"; // 2️⃣ Occupancy vs Cash Flow
import BreakEvenBarChart from "./BreakEvenBarChart"; // 3️⃣ Revenue vs Cost Stack
import "../../styles/BreakEvenCalculator.css";

const BreakEvenCalculatorPage = () => {
  const [results, setResults] = useState(null);

  const handleResults = (calculatedData) => {
    // Include all fields needed for charts
    const fullResults = {
      ...calculatedData,
      monthlyRent: calculatedData.monthlyRent || 2000,
      occupancyRate: calculatedData.occupancyRate || 75,
      otherIncome: calculatedData.otherIncome || 0,
      propertyTax: calculatedData.propertyTax || 300,
      insurance: calculatedData.insurance || 100,
      maintenance: calculatedData.maintenance || 150,
      managementFee: calculatedData.propertyManagement || 200,
      utilities: calculatedData.utilities || 200,
    };
    setResults(fullResults);
  };

  return (
    <div className="breakeven-calculator-wrapper">
      <header className="calculator-header">
        <h1>EEML Break-Even Calculator</h1>
        <p className="subtitle">
          Find out how many units you need to sell or how much revenue you need
          to cover all costs.
        </p>
      </header>

      <div className="calculator-grid">
        {/* Info Column */}
        <aside className="info-column">
          <h2>What is Break-Even Point?</h2>
          <p>
            The break-even point is the level of sales at which your total
            revenue equals your total costs — meaning you're not making a profit
            but you're not losing money either.
          </p>
          <h4>Formula:</h4>
          <p>
            <strong>
              Break-Even Point (Units) = Fixed Costs ÷ (Selling Price − Variable
              Cost per Unit)
            </strong>
          </p>
          <ul>
            <li>
              <strong>Fixed Costs:</strong> Costs that remain constant
              regardless of output
            </li>
            <li>
              <strong>Variable Costs:</strong> Costs that vary directly with the
              number of units produced or sold
            </li>
            <li>
              <strong>Selling Price:</strong> Price at which you sell each unit
            </li>
          </ul>
        </aside>

        {/* Form Column */}
        <div className="form-column">
          <BreakEvenForm setResults={handleResults} />
        </div>

        {/* Results Column */}
        <div className="results-column">
          {results ? (
            <>
              <BreakEvenResults data={results} />

              {/* Charts */}
              <div className="charts-wrapper">
                <div className="chart-container">
                  <h3>Break-Even Rent Curve</h3>
                  <BreakEvenChart data={results} />
                </div>

                <div className="chart-container">
                  <h3>Occupancy vs Cash Flow</h3>
                  <BreakEvenOccupancy data={results} />
                </div>

                <div className="chart-container">
                  <h3>Revenue vs Cost Stack</h3>
                  <BreakEvenBarChart data={results} />
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Results Yet</h3>
              <p>Fill out the form to calculate your break-even point</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakEvenCalculatorPage;
