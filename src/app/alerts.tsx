import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const MOCK_ALERTS = [
  { id: 1, message: 'Niveles de radiación dentro del umbral seguro', type: 'info', time: 'Hace 2 horas' },
  { id: 2, message: 'Su próximo tratamiento es en 3 días', type: 'warning', time: 'Hace 1 día' },
  { id: 3, message: 'No olvide tomar su medicación', type: 'reminder', time: 'Hace 2 días' },
];

export default function AlertsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        {MOCK_ALERTS.map((alert) => (
          <View key={alert.id} style={[styles.alertCard, alert.type === 'warning' && styles.warningCard]}>
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <Text style={styles.alertTime}>{alert.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  section: { padding: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  alertCard: { backgroundColor: '#111827', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#00D9FF' },
  warningCard: { borderLeftColor: '#F59E0B' },
  alertMessage: { fontSize: 14, color: '#fff', marginBottom: 8 },
  alertTime: { fontSize: 12, color: '#6B7280' },
});