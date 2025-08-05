import React, { useState } from "react";
import ROIForm from "./ROIForm";
import ROIResults from "./ROIResults";
import ROIChart from "./ROIChart";

function ROICalculatorPage() {
  const [results, setResults] = useState(null);

  return (
    <div>
      <h1>ROI Calculator</h1>
      <ROIForm setResults={setResults} />
      <ROIResults results={results} />
      <ROIChart results={results} />
    </div>
  );
}

export default ROICalculatorPage;
