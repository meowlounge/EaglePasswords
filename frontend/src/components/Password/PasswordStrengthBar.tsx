import React, { useState, useEffect } from 'react';

type GradientType = 'danger' | 'warning' | 'success' | 'info';

interface PasswordStrengthBarProps {
     percentage: number;
     variant?: GradientType;
}

export const gradientVariants = {
     danger: 'bg-red-600 dark:bg-red-700',
     warning: 'bg-yellow-500 dark:bg-amber-600',
     success: 'bg-green-500 dark:bg-emerald-600',
     info: 'bg-blue-500 dark:bg-sky-600',
};

export const PasswordStrengthBar = ({
     percentage,
     variant = 'info',
}: PasswordStrengthBarProps) => {
     const [animatedWidth, setAnimatedWidth] = useState(0);

     useEffect(() => {
          const timeout = setTimeout(() => setAnimatedWidth(percentage), 0);
          return () => clearTimeout(timeout);
     }, [percentage]);

     return (
          <div className='absolute top-0 left-0 w-full h-0.5 bg-neutral-100 dark:bg-neutral-800'>
               <div
                    className={`h-full transition-all ease-fluid duration-3000 ${gradientVariants[variant]}`}
                    style={{ width: `${animatedWidth}%` }}
               />
          </div>
     );
};
