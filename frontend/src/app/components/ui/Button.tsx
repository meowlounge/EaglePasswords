import React from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "./Spinner";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "border" | "danger";
    size?: "sm" | "md" | "lg";
    icon?: LucideIcon;
    content?: string;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    content,
    children,
    variant = "primary",
    size = "md",
    loading = false,
    icon: Icon,
    className,
    disabled,
    ...props
}) => {
    const baseStyles =
        "inline-flex h-10 items-center justify-center font-medium active:scale-95 transition-all duration-300 rounded-xl disabled:opacity-60 disabled:pointer-events-none";

    const variants = {
        primary: "bg-neutral-200 text-neutral-900 hover:bg-neutral-400/50 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800/50",
        secondary: "bg-neutral-300 text-neutral-900 hover:bg-neutral-600/50 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-600/50",
        ghost: "bg-transparent text-neutral-900 hover:bg-neutral-400/50 dark:bg-transparent dark:text-neutral-100 dark:hover:bg-neutral-700/80",
        border: "border border-neutral-300 hover:border-transparent text-neutral-900 hover:bg-neutral-400/50 dark:border-neutral-700/50 dark:text-neutral-100 dark:hover:bg-neutral-700/50",
        danger: "bg-red-400 text-neutral-100 hover:bg-red-500 dark:bg-red-500 dark:text-neutral-100 dark:hover:bg-red-500/80",
    };

    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className,
                !content && !children && Icon ? "p-2" : ""
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Spinner className="w-6 h-6" />
            ) : (
                <>
                    {Icon && (
                        <Icon
                            size={16}
                            className={cn(
                                content || children ? "lg:mr-2" : ""
                            )}
                        />
                    )}
                    <span className="hidden lg:inline">{content || children}</span>
                </>
            )}
        </button>
    );
};
