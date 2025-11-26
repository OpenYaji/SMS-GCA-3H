import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('accentColor') || 'amber';
    });

    useEffect(() => {
        const root = document.documentElement;

        // Apply theme
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
        localStorage.setItem('theme', theme);

        // Apply accent color as CSS variable
        const accentColors = {
            green: '#4ade80',
            amber: '#fbbf24',
            rose: '#f43f5e',
            orange: '#f97316'
        };

        root.style.setProperty('--accent-color', accentColors[accentColor]);
        localStorage.setItem('accentColor', accentColor);
    }, [theme, accentColor]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    const changeAccentColor = (color) => {
        setAccentColor(color);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            accentColor,
            toggleTheme,
            changeTheme,
            changeAccentColor
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
