// components/Spinner.tsx
import React from "react";

interface SpinnerProps {
    className?: string;
}

/**
 * Spinner component that renders a loading spinner.
 * The spinner can be customized with a `className` prop to add extra styling.
 * 
 * @param {string} className - Optional class name for custom styling.
 * @returns {JSX.Element} The rendered spinner component.
 */
export const Spinner: React.FC<SpinnerProps> = ({ className = "" }) => {
    return (
        <svg
            className={`animate-spin ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
            ></path>
        </svg>
    );
};
