import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

// Add debug class to body in development
if (process.env.NODE_ENV === "development") {
  document.body.classList.add("debug");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
