// components/Spinner.tsx
import React from 'react';

interface SpinnerProps {
     className?: string;
     size?: string; // Customizable size (default is 'w-12 h-12')
     color?: string; // Customizable color (default is 'currentColor')
     strokeWidth?: number; // Customizable stroke width (default is 4)
     speed?: string; // Customizable animation speed (default is '1s')
}

/**
 * Spinner component that renders a customizable loading spinner.
 * The spinner's size, color, stroke width, and animation speed can be customized via props.
 *
 * @param {string} className - Optional class name for additional styling.
 * @param {string} size - Optional size (width and height) of the spinner.
 * @param {string} color - Optional color for the spinner (uses 'currentColor' by default).
 * @param {number} strokeWidth - Optional stroke width for the spinner.
 * @param {string} speed - Optional speed for the spinner's animation (in seconds).
 * @returns {JSX.Element} The rendered spinner component.
 */
export const Spinner: React.FC<SpinnerProps> = ({
     className = '',
     size = 'w-12 h-12',
     color = 'currentColor',
     strokeWidth = 4,
     speed = '1s',
}) => {
     return (
          <svg
               className={`animate-spin ${size} ${className}`}
               xmlns='http://www.w3.org/2000/svg'
               fill='none'
               viewBox='0 0 24 24'
               style={{ animationDuration: speed }}
          >
               <circle
                    className='opacity-100'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke={color}
                    strokeWidth={strokeWidth}
               ></circle>
               <path
                    className='opacity-75'
                    fill={color}
                    d='M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z'
               ></path>
          </svg>
     );
};
