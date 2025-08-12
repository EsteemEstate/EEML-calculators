// src/components/SectionTitleWithTooltip.jsx
import React from "react";

const SectionTitleWithTooltip = ({ title, description }) => {
  return (
    <div className="section-title-container">
      <h2 className="section-title">{title}</h2>
      <div className="tooltip">
        <span className="tooltip-text">{description}</span>
      </div>
    </div>
  );
};

export default SectionTitleWithTooltip;
