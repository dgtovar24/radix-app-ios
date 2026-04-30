export interface PaletteColors {
  primary: string;
  primaryLight: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean;
  colors: PaletteColors;
}

export type PaletteId =
  | 'hospital-purple'
  | 'ocean-depths'
  | 'forest-sanctuary'
  | 'sunset-glow'
  | 'midnight-command'
  | 'slate-elegance'
  | 'rose-diagnostic'
  | 'teal-vital';

export interface ThemeContextType {
  colors: PaletteColors;
  palette: ColorPalette;
  setPaletteById: (id: string) => void;
  presets: ColorPalette[];
  isDark: boolean;
}

export const STORAGE_KEY = 'radix-palette';
export const ONBOARDING_KEY = 'radix-onboarding-done';
