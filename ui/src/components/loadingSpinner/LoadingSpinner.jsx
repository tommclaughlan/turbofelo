import React from "react";
import "./LoadingSpinner.css";

export default function LoadingSpinner({ size }) {
    const spinnerClass =
        size === "small" ? "loading-spinner-small" : "loading-spinner-medium";

    return (
        <div className="spinner-container">
            <div className={`loading-spinner ${spinnerClass}`} />
        </div>
    );
}
