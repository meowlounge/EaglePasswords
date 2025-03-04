'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
	theme: 'light' | 'dark';
	toggleTheme: () => void;
}

interface ThemeProviderProps {
	children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [theme, setTheme] = useState<'light' | 'dark'>('light');

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as
			| 'light'
			| 'dark'
			| null;
		if (savedTheme) {
			setTheme(savedTheme);
		}
	}, []);

	useEffect(() => {
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
