import { useTheme } from './ThemeContext';
import type { PaletteColors } from './types';

type ColorKey = keyof PaletteColors;

export function useThemeColor(key: ColorKey): string {
  const { colors } = useTheme();
  return colors[key];
}

export function useThemeColors(): PaletteColors {
  const { colors } = useTheme();
  return colors;
}
