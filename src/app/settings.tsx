import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notificaciones</Text>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: '#00D9FF' }} />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Tema Oscuro</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: '#00D9FF' }} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Unidades</Text>
        <View style={styles.unitSelector}>
          <TouchableOpacity style={[styles.unitOption, true && styles.unitSelected]}>
            <Text style={styles.unitText}>Métrico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.unitOption}>
            <Text style={styles.unitText}>Imperial</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>Radix Medical v1.0.0</Text>
          <Text style={styles.aboutSubtext}>Panel de gestión de tratamientos радиológicos</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  section: { padding: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  settingCard: { backgroundColor: '#111827', borderRadius: 16, padding: 8 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  settingLabel: { fontSize: 16, color: '#fff' },
  unitSelector: { flexDirection: 'row', gap: 12 },
  unitOption: { flex: 1, backgroundColor: '#111827', borderRadius: 12, padding: 16, alignItems: 'center' },
  unitSelected: { backgroundColor: '#00D9FF' },
  unitText: { color: '#fff', fontWeight: '600' },
  aboutCard: { backgroundColor: '#111827', borderRadius: 16, padding: 20, alignItems: 'center' },
  aboutText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  aboutSubtext: { fontSize: 12, color: '#6B7280', marginTop: 4 },
});