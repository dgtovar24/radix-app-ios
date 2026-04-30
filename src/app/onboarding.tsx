import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../theme/useThemeColor';
import { useTheme } from '../theme/ThemeContext';
import { ONBOARDING_KEY } from '../theme/types';
import { PRESET_PALETTES } from '../theme/palettes';
import type { ColorPalette } from '../theme/types';
import Card from '../components/Card';

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { setPaletteById } = useTheme();

  const handleSelect = async (palette: ColorPalette) => {
    setPaletteById(palette.id);
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    router.replace('/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Radix
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Elige tu estilo
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          Selecciona una paleta de colores para personalizar tu experiencia.
          Podrás cambiarla después en Ajustes.
        </Text>

        {PRESET_PALETTES.map((palette) => (
          <Card key={palette.id} style={styles.paletteCard}>
            <TouchableOpacity
              onPress={() => handleSelect(palette)}
              activeOpacity={0.7}
              style={styles.paletteTouch}
            >
              <Text style={[styles.paletteName, { color: colors.text }]}>
                {palette.name}
              </Text>
              <Text style={[styles.paletteDesc, { color: colors.textSecondary }]}>
                {palette.description}
              </Text>

              <View style={styles.swatches}>
                <View style={[styles.swatch, { backgroundColor: palette.colors.primary }]} />
                <View style={[styles.swatch, { backgroundColor: palette.colors.secondary }]} />
                <View style={[styles.swatch, { backgroundColor: palette.colors.surface, borderWidth: 1, borderColor: palette.colors.border }]} />
                <View style={[styles.swatch, { backgroundColor: palette.colors.text }]} />
                <View style={[styles.swatch, { backgroundColor: palette.colors.accent }]} />
              </View>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 4,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  scroll: { flex: 1 },
  grid: { padding: 24, gap: 12 },
  instruction: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  paletteCard: { padding: 0, overflow: 'hidden' },
  paletteTouch: { padding: 16 },
  paletteName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  paletteDesc: {
    fontSize: 13,
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  swatches: {
    flexDirection: 'row',
    gap: 8,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
});
