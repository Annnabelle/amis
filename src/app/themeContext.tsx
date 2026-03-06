import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  themeMode: ThemeMode;
  isDarkTheme: boolean;
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeContext.Provider');
  }
  return context;
};
