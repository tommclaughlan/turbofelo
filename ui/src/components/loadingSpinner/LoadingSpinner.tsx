import React from "react";
import "./LoadingSpinner.css";

type Size = "small" | "medium" | "large";

interface LoadingSpinnerProps {
    size?: Size;
}

export default function LoadingSpinner({ size }: LoadingSpinnerProps) {
    const spinnerClass =
        size === "small" ? "loading-spinner-small" : "loading-spinner-medium";

    return (
        <div className="spinner-container">
            <div className={`loading-spinner ${spinnerClass}`} />
        </div>
    );
}
