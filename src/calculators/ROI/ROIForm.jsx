import React, { useState } from "react";
import { calculateROI } from "../../utils/formulas";

function ROIForm({ setResults }) {
  const [inputs, setInputs] = useState({
    price: 0,
    rent: 0,
    expenses: 0,
    appreciationRate: 0,
    holdingPeriod: 1,
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const roi = calculateROI(inputs);
    setResults({ roi, ...inputs });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="price"
        type="number"
        onChange={handleChange}
        placeholder="Property Price"
      />
      <input
        name="rent"
        type="number"
        onChange={handleChange}
        placeholder="Monthly Rent"
      />
      <input
        name="expenses"
        type="number"
        onChange={handleChange}
        placeholder="Monthly Expenses"
      />
      <input
        name="appreciationRate"
        type="number"
        onChange={handleChange}
        placeholder="Appreciation Rate (%)"
      />
      <input
        name="holdingPeriod"
        type="number"
        onChange={handleChange}
        placeholder="Holding Period (Years)"
      />
      <button type="submit">Calculate ROI</button>
    </form>
  );
}

export default ROIForm;
