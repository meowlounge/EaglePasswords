import React, { useState, useEffect } from 'react';

type GradientType = 'danger' | 'warning' | 'success' | 'info';

interface PasswordStrengthBarProps {
     percentage: number;
     variant?: GradientType;
}

export const gradientVariants = {
     danger: 'bg-gradient-to-tr from-red-500 to-red-700 dark:from-red-600 dark:to-rose-950',
     warning: 'bg-gradient-to-tr from-yellow-400 to-orange-600 dark:from-amber-600 dark:to-orange-950',
     success: 'bg-gradient-to-tr from-green-400 to-green-600 dark:from-green-600 dark:to-emerald-950',
     info: 'bg-gradient-to-tr from-blue-400 to-blue-600 dark:from-blue-600 dark:to-sky-950',
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
                    className={`h-full transition-all ease-out duration-[4050ms] ${gradientVariants[variant]}`}
                    style={{ width: `${animatedWidth}%` }}
               />
          </div>
     );
};
