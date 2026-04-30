import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TreatmentScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusBanner}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Tratamiento Activo</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles del Tratamiento</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Radioisótopo</Text>
            <Text style={styles.detailValue}>I-131</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dosis Total</Text>
            <Text style={styles.detailValue}>150 mCi</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Umbral de Seguridad</Text>
            <Text style={styles.detailValue}>200 mSv</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Habitación</Text>
            <Text style={styles.detailValue}>101</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha de Inicio</Text>
            <Text style={styles.detailValue}>15 Ene 2026</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha de Fin</Text>
            <Text style={styles.detailValue}>15 Feb 2026</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Radiación</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>Gráfico de radiación en desarrollo</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  statusBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B98120', margin: 24, padding: 16, borderRadius: 12, gap: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
  statusText: { fontSize: 16, fontWeight: '600', color: '#10B981' },
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  detailsCard: { backgroundColor: '#111827', borderRadius: 16, padding: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  detailLabel: { fontSize: 14, color: '#9CA3AF' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#fff' },
  chartPlaceholder: { backgroundColor: '#111827', borderRadius: 16, padding: 40, alignItems: 'center' },
  chartText: { color: '#6B7280', fontSize: 14 },
});