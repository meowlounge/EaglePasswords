'use client'

import { useState, useEffect, useCallback } from "react";

const getInitialTheme = (): boolean => {
    if (typeof window === "undefined") return true;

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const setTheme = (isDarkMode: boolean) => {
    if (typeof window !== "undefined") {
        const theme = isDarkMode ? "dark" : "light";
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", isDarkMode);
    }
};

/**
 * Custom hook for managing light and dark mode.
 * Handles initialization, toggling, and syncing with localStorage and the document's class list.
 *
 * @returns {Object} - Contains `darkMode` (boolean) and `toggleDarkMode` (function).
 */
export const useTheme = () => {
    const [darkMode, setDarkMode] = useState(getInitialTheme);
    const [isHydrated, setIsHydrated] = useState(false);

    const toggleDarkMode = useCallback(() => {
        setDarkMode((prev) => {
            const newMode = !prev;
            setTheme(newMode);
            return newMode;
        });
    }, []);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated) {
            setTheme(darkMode);
        }
    }, [darkMode, isHydrated]);

    return { darkMode, toggleDarkMode };
};
