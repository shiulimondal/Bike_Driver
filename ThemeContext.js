import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setIsDarkMode(colorScheme === 'dark');
        });

        return () => subscription.remove();
    }, []);

    const colors = {
        dark: {
            primaryThemeColor: '#FEC400',
            secondaryThemeColor: '#ffffff',
            primaryFontColor: '#000000',
            secondaryFontColor: '#D9D9D9',
            subFontcolor:'#A0A0A0',
            tintText: '#5A5A5A',
            cardColor: '#f3f3f3',
            inputBorder:'rgba(246, 205, 86, 1)',
            inputBox:'rgba(255, 253, 231, 1)',
            shadowColor: '#999',
            statusBarStyle: 'light-content',
            borderColor: '#D0D0D0',
            buttonColor: '#EDAE10',
        },
        light: {
            primaryThemeColor: '#FEC400',
            secondaryThemeColor: '#ffffff',
            primaryFontColor: '#000000',
            secondaryFontColor: '#D9D9D9',
            subFontcolor:'#A0A0A0',
            tintText: '#5A5A5A',
            cardColor: '#f3f3f3',
            inputBorder:'rgba(246, 205, 86, 1)',
            inputBox:'rgba(255, 253, 231, 1)',
            shadowColor: '#999',
            statusBarStyle: 'light-content',
            borderColor: '#D0D0D0',
            buttonColor: '#EDAE10',
        },
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, colors: isDarkMode ? colors.dark : colors.light }}>
            {children}
        </ThemeContext.Provider>
    );
};
