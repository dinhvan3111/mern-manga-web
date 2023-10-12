import React from "react";
import "./LoadingSpinner.css";

function CircleLoadingForOverlay(props) {
  return (
    <div
      className={`overlay-loading-spinner ${props.show ? "show" : ""} z-[9999]`}
    >
      <div className="loading-spinner"></div>
    </div>
  );
}

export default CircleLoadingForOverlay;
