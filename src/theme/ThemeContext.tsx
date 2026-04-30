import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import type { ThemeContextType, ColorPalette, PaletteColors } from './types';
import { STORAGE_KEY } from './types';
import { PRESET_PALETTES, DEFAULT_PALETTE, getPaletteById } from './palettes';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function isDarkBackground(background: string): boolean {
  return background === '#0f172a' || background === '#000000';
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<ColorPalette>(DEFAULT_PALETTE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSavedPalette();
  }, []);

  const loadSavedPalette = async () => {
    try {
      const saved = await SecureStore.getItemAsync(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ColorPalette;
        if (parsed && parsed.colors && parsed.id) {
          setPaletteState(parsed);
        }
      }
    } catch {
      SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
    } finally {
      setReady(true);
    }
  };

  const persistPalette = async (p: ColorPalette) => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {
      console.warn('[RADIX] Failed to save palette:', e);
    }
  };

  const setPaletteById = useCallback((id: string) => {
    const found = getPaletteById(id);
    if (found) {
      setPaletteState(found);
      persistPalette(found);
    }
  }, []);

  const colors: PaletteColors = palette.colors;
  const dark = isDarkBackground(colors.background);

  if (!ready) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        colors,
        palette,
        setPaletteById,
        presets: PRESET_PALETTES,
        isDark: dark,
      }}
    >
      <StatusBar style={dark ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      colors: DEFAULT_PALETTE.colors,
      palette: DEFAULT_PALETTE,
      setPaletteById: () => {},
      presets: PRESET_PALETTES,
      isDark: false,
    };
  }
  return context;
}
