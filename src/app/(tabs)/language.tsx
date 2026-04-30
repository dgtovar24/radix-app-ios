import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../../theme/useThemeColor';
import Card from '../../components/Card';
import { GlobeIcon } from '../../components/Icons';

const LANGUAGES = [
  { code: 'es', name: 'Español', native: 'Español' },
  { code: 'en', name: 'English', native: 'English' },
];

export default function LanguageScreen() {
  const colors = useThemeColors();
  const [selected, setSelected] = useState('es');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <GlobeIcon color={colors.primary} size={32} />
        <Text style={[styles.title, { color: colors.text }]}>Idioma</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Selecciona el idioma de la aplicación
        </Text>
      </View>

      <Card style={styles.listCard}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => setSelected(lang.code)}
            style={styles.langRow}
            activeOpacity={0.6}
          >
            <View style={styles.langInfo}>
              <Text style={[styles.langName, { color: colors.text }]}>
                {lang.native}
              </Text>
              <Text style={[styles.langEn, { color: colors.textSecondary }]}>
                {lang.name}
              </Text>
            </View>
            <View
              style={[
                styles.radio,
                {
                  borderColor:
                    selected === lang.code ? colors.primary : colors.border,
                },
              ]}
            >
              {selected === lang.code && (
                <View
                  style={[styles.radioFill, { backgroundColor: colors.primary }]}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 24, gap: 8 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter',
  },
  listCard: { padding: 4 },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  langInfo: { gap: 2 },
  langName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  langEn: {
    fontSize: 13,
    fontFamily: 'Inter',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
