import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  type DimensionValue,
} from 'react-native';
import { useThemeColors } from '../../theme/useThemeColor';
import Card from '../../components/Card';
import { LineChart } from '../../components/Charts';
import StatusDot from '../../components/StatusDot';
import ProgressBar from '../../components/ProgressBar';

function generateRadiationData() {
  const data: { label: string; value: number; threshold: number }[] = [];
  const now = new Date();
  const halfLife = 8.02; // I-131 half-life in days
  const initialValue = 150;
  const threshold = 200;

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    const day = 14 - i;
    const decay = initialValue * Math.pow(0.5, day / halfLife);
    const random = decay * (0.9 + Math.random() * 0.2);

    data.push({
      label: `D${day}`,
      value: +random.toFixed(1),
      threshold,
    });
  }

  return data;
}

export default function RadiationHistoryScreen() {
  const colors = useThemeColors();
  const { width: screenW } = useWindowDimensions();
  const chartW = screenW - 96;

  const data = useMemo(() => generateRadiationData(), []);
  const current = data[data.length - 1].value;
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  const status =
    current > 150 ? ('error' as const) : current > 50 ? ('warning' as const) : ('active' as const);
  const statusLabel =
    current > 150 ? 'Alto' : current > 50 ? 'Moderado' : 'Bajo';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.currentCard}>
        <View style={styles.currentHeader}>
          <Text style={[styles.currentLabel, { color: colors.textSecondary }]}>
            Nivel Actual
          </Text>
          <View style={styles.statusRow}>
            <StatusDot status={status} size={10} />
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    status === 'error'
                      ? colors.error
                      : status === 'warning'
                      ? colors.warning
                      : colors.success,
                },
              ]}
            >
              {statusLabel}
            </Text>
          </View>
        </View>
        <Text style={[styles.currentValue, { color: colors.text }]}>
          {current.toFixed(1)}
          <Text style={[styles.currentUnit, { color: colors.textSecondary }]}>
            {' '}mSv
          </Text>
        </Text>
        <View style={{ height: 8 }} />
        <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
          Progreso de decaimiento
        </Text>
        <ProgressBar progress={(150 - current) / 150} color={colors.success} />
      </Card>

      <Card style={styles.chartCard}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Historial de Radiación
        </Text>
        <LineChart
          data={data}
          width={chartW}
          height={200}
          color={colors.primary}
          maxValue={maxVal * 1.1}
          showDots
        />
      </Card>

      <Card style={styles.tableCard}>
        <Text style={[styles.tableTitle, { color: colors.text }]}>
          Registro Diario
        </Text>
        {data.slice(-7).reverse().map((d, i) => {
            const pct = `${((d.value / 150) * 100).toFixed(0)}%` as DimensionValue;
          const barColor =
            d.value > 150
              ? colors.error
              : d.value > 50
              ? colors.warning
              : colors.success;

          return (
            <View
              key={i}
              style={[
                styles.tableRow,
                i < data.slice(-7).length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.tableDay, { color: colors.text }]}>
                {d.label}
              </Text>
              <Text style={[styles.tableValue, { color: colors.text }]}>
                {d.value.toFixed(1)} mSv
              </Text>
              <View style={styles.tableBarTrack}>
                <View
                  style={[
                    styles.tableBar,
                    { backgroundColor: barColor, width: pct },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  currentCard: { padding: 20, marginBottom: 16 },
  currentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Inter',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  currentValue: {
    fontSize: 42,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  currentUnit: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  progressLabel: {
    fontSize: 13,
    marginBottom: 6,
    fontFamily: 'Inter',
  },
  chartCard: { padding: 20, marginBottom: 16 },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  tableCard: { padding: 20, marginBottom: 16 },
  tableTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  tableRow: {
    paddingVertical: 12,
    gap: 6,
  },
  tableDay: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  tableValue: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  tableBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  tableBar: {
    height: '100%',
    borderRadius: 2,
  },
});
