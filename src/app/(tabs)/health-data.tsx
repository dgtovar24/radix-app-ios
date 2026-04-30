import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeColors } from '../../theme/useThemeColor';
import Card from '../../components/Card';
import { HeartIcon, ActivityIcon, ShieldIcon } from '../../components/Icons';

interface MetricEntry {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

export default function HealthDataScreen() {
  const colors = useThemeColors();

  const metrics: MetricEntry[] = [
    {
      label: 'Ritmo Cardíaco Promedio',
      value: 72,
      unit: 'BPM',
      icon: <HeartIcon color={colors.primary} size={24} />,
      color: colors.primary,
    },
    {
      label: 'Pasos Hoy',
      value: 4521,
      unit: 'pasos',
      icon: <ActivityIcon color={colors.success} size={24} />,
      color: colors.success,
    },
    {
      label: 'Distancia Recorrida',
      value: 3.2,
      unit: 'km',
      icon: <ActivityIcon color={colors.accent} size={24} />,
      color: colors.accent,
    },
    {
      label: 'Nivel de Radiación',
      value: 0.08,
      unit: 'mSv',
      icon: <ShieldIcon color={colors.warning} size={24} />,
      color: colors.warning,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Datos de Salud
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Métricas actualizadas en tiempo real desde tu dispositivo vinculado.
      </Text>

      {metrics.map((m, i) => (
        <Card key={i} style={styles.metricRow}>
          <View style={styles.metricIcon}>{m.icon}</View>
          <View style={styles.metricInfo}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              {m.label}
            </Text>
            <Text style={[styles.metricValue, { color: m.color }]}>
              {m.value.toLocaleString()}
              <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>
                {' '}{m.unit}
              </Text>
            </Text>
          </View>
        </Card>
      ))}

      <Card style={styles.historyCard}>
        <Text style={[styles.historyTitle, { color: colors.text }]}>
          Historial
        </Text>
        <Text style={[styles.historyPlaceholder, { color: colors.textSecondary }]}>
          El historial detallado de métricas estará disponible próximamente.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: 'Inter',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  metricInfo: { flex: 1 },
  metricLabel: {
    fontSize: 13,
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  historyCard: { padding: 20, marginTop: 8 },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  historyPlaceholder: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
});
