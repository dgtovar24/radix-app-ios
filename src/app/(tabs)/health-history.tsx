import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useThemeColors } from '../../theme/useThemeColor';
import { useHealthHistory } from '../../hooks/useHealthKit';
import Card from '../../components/Card';
import { BarChart, LineChart, AreaChart } from '../../components/Charts';

type TimeFilter = '24h' | '7d' | '30d';

function generateData(filter: TimeFilter) {
  const now = new Date();
  let points: number;
  let format: (d: Date) => string;

  if (filter === '24h') {
    points = 24;
    format = (d) => `${d.getHours()}h`;
  } else if (filter === '7d') {
    points = 7;
    format = (d) =>
      d.toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 3);
  } else {
    points = 30;
    format = (d) => d.getDate().toString();
  }

  const bpmData: { label: string; value: number }[] = [];
  const stepsData: { label: string; value: number }[] = [];
  const distanceData: { label: string; value: number }[] = [];

  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now);
    if (filter === '24h') {
      d.setHours(d.getHours() - i);
    } else {
      d.setDate(d.getDate() - i);
    }

    bpmData.push({ label: format(d), value: Math.floor(Math.random() * 25) + 65 });
    stepsData.push({ label: format(d), value: Math.floor(Math.random() * 4000) + 2500 });
    distanceData.push({ label: format(d), value: +(Math.random() * 2.5 + 1.5).toFixed(1) });
  }

  return { bpmData, stepsData, distanceData };
}

export default function HealthHistoryScreen() {
  const colors = useThemeColors();
  const { width: screenW } = useWindowDimensions();
  const chartW = screenW - 96;
  const [filter, setFilter] = useState<TimeFilter>('7d');

  const { heartRate: hkHeartRate, steps: hkSteps, loading: hkLoading } = useHealthHistory(
    filter === '24h' ? 1 : filter === '7d' ? 7 : 30
  );

  const mockData = useMemo(() => generateData(filter), [filter]);
  const bpmData = hkHeartRate.length > 0 ? hkHeartRate : mockData.bpmData;
  const stepsData = hkSteps.length > 0 ? hkSteps : mockData.stepsData;
  const distanceData = mockData.distanceData;

  const filters: TimeFilter[] = ['24h', '7d', '30d'];
  const filterLabels: Record<TimeFilter, string> = {
    '24h': '24h',
    '7d': '7 días',
    '30d': '30 días',
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f ? colors.primary : colors.surface,
                borderColor: filter === f ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {filterLabels[f]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.chartCard}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Ritmo Cardíaco (BPM)
        </Text>
        <LineChart
          data={bpmData}
          width={chartW}
          height={180}
          color={colors.error}
          maxValue={100}
          showDots
        />
        <View style={styles.legend}>
          <Text style={[styles.legendAvg, { color: colors.textSecondary }]}>
            Promedio:{' '}
            <Text style={{ color: colors.error, fontWeight: '700' }}>
              {Math.round(bpmData.reduce((s, d) => s + d.value, 0) / bpmData.length)} BPM
            </Text>
          </Text>
        </View>
      </Card>

      <Card style={styles.chartCard}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Pasos
        </Text>
        <BarChart
          data={stepsData}
          width={chartW}
          height={180}
          color={colors.accent}
          maxValue={7000}
        />
        <View style={styles.legend}>
          <Text style={[styles.legendAvg, { color: colors.textSecondary }]}>
            Total:{' '}
            <Text style={{ color: colors.accent, fontWeight: '700' }}>
              {stepsData.reduce((s, d) => s + d.value, 0).toLocaleString()} pasos
            </Text>
          </Text>
        </View>
      </Card>

      <Card style={styles.chartCard}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Distancia (km)
        </Text>
        <AreaChart
          data={distanceData}
          width={chartW}
          height={180}
          color={colors.success}
          maxValue={5}
        />
        <View style={styles.legend}>
          <Text style={[styles.legendAvg, { color: colors.textSecondary }]}>
            Total:{' '}
            <Text style={{ color: colors.success, fontWeight: '700' }}>
              {distanceData.reduce((s, d) => s + d.value, 0).toFixed(1)} km
            </Text>
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  chartCard: { padding: 20, marginBottom: 16 },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  legend: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  legendAvg: {
    fontSize: 13,
    fontFamily: 'Inter',
  },
});
