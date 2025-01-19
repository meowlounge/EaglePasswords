'use client'

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing light and dark mode.
 * Handles initialization, toggling, and syncing with localStorage and the document's class list.
 *
 * @returns {Object} - Contains `darkMode` (boolean) and `toggleDarkMode` (function).
 */
export const useTheme = () => {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            if (localStorage.theme === "dark") return true;
            if (localStorage.theme === "light") return false;
            return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return false;
    });

    const toggleDarkMode = useCallback(() => {
        setDarkMode((prev) => {
            const newMode = !prev;
            if (typeof window !== "undefined") {
                if (newMode) {
                    localStorage.theme = "dark";
                    document.documentElement.classList.add("dark");
                } else {
                    localStorage.theme = "light";
                    document.documentElement.classList.remove("dark");
                }
            }
            return newMode;
        });
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (darkMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, [darkMode]);

    return { darkMode, toggleDarkMode };
};
