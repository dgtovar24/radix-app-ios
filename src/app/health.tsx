import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HealthScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métricas de Salud</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Ritmo Cardíaco</Text>
            <Text style={styles.metricValue}>72</Text>
            <Text style={styles.metricUnit}>BPM</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pasos</Text>
            <Text style={styles.metricValue}>4,521</Text>
            <Text style={styles.metricUnit}>pasos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Distancia</Text>
            <Text style={styles.metricValue}>3.2</Text>
            <Text style={styles.metricUnit}>km</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Radiación Actual</Text>
            <Text style={styles.metricValue}>0.02</Text>
            <Text style={styles.metricUnit}>mSv</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial Reciente</Text>
        <View style={styles.historyPlaceholder}>
          <Text style={styles.historyText}>Historial de métricas en desarrollo</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  section: { padding: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '47%', backgroundColor: '#111827', borderRadius: 16, padding: 20, alignItems: 'center' },
  metricLabel: { fontSize: 12, color: '#9CA3AF', textTransform: 'uppercase' },
  metricValue: { fontSize: 32, fontWeight: '700', color: '#00D9FF', marginVertical: 8 },
  metricUnit: { fontSize: 12, color: '#6B7280' },
  historyPlaceholder: { backgroundColor: '#111827', borderRadius: 16, padding: 40, alignItems: 'center' },
  historyText: { color: '#6B7280', fontSize: 14 },
});