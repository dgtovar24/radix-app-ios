import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>P</Text>
        </View>
        <Text style={styles.name}>Paciente</Text>
        <Text style={styles.role}>Paciente en tratamiento</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Código de acceso familiar</Text>
            <Text style={styles.infoValue}>FAM-ABC12345</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>No configurado</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dirección</Text>
            <Text style={styles.infoValue}>No configurada</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  header: { alignItems: 'center', paddingVertical: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00D9FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#0A0E27' },
  name: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 16 },
  role: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
  section: { padding: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  infoCard: { backgroundColor: '#111827', borderRadius: 16, padding: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  infoLabel: { fontSize: 14, color: '#9CA3AF' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#fff' },
});