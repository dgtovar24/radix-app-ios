import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { patientService } from '../services/api';

interface HealthData {
  bpm: number;
  steps: number;
  radiation: number;
}

interface AlertItem {
  id: number;
  message: string;
  alertType: string;
  isResolved: boolean;
  createdAt: string;
}

interface TreatmentInfo {
  room: number;
  startDate: string;
  endDate: string;
  initialDose: number;
  isolationDays: number;
  isActive: boolean;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({ bpm: 0, steps: 0, radiation: 0 });
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [treatment, setTreatment] = useState<TreatmentInfo | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const [userId, role] = await Promise.all([
        SecureStore.getItemAsync('user_id'),
        SecureStore.getItemAsync('user_role'),
      ]);

      if (role === 'patient' && userId) {
        const patients = await patientService.getAll(token);
        if (patients.length > 0) {
          setUserName(patients[0].fullName);
        }
      }

      setHealthData({ bpm: 72, steps: 4521, radiation: 0.02 });
      setAlerts([
        { id: 1, message: 'Niveles de radiación dentro del umbral seguro', alertType: 'info', isResolved: false, createdAt: new Date().toISOString() },
        { id: 2, message: 'Su próximo tratamiento es en 3 días', alertType: 'warning', isResolved: false, createdAt: new Date().toISOString() },
      ]);
      setTreatment({ room: 101, startDate: '2026-01-15', endDate: '2026-02-15', initialDose: 150, isolationDays: 14, isActive: true });
    } catch (error) {
      console.error('Dashboard error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_id');
    await SecureStore.deleteItemAsync('user_role');
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00D9FF" />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenido</Text>
          <Text style={styles.userName}>{userName || 'Paciente'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado de Salud</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ritmo Cardíaco</Text>
            <Text style={styles.statValue}>{healthData.bpm}</Text>
            <Text style={styles.statUnit}>BPM</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pasos Hoy</Text>
            <Text style={styles.statValue}>{healthData.steps.toLocaleString()}</Text>
            <Text style={styles.statUnit}>pasos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Radiación</Text>
            <Text style={styles.statValue}>{healthData.radiation}</Text>
            <Text style={styles.statUnit}>mSv</Text>
          </View>
        </View>
      </View>

      {treatment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Tratamiento</Text>
          <View style={styles.treatmentCard}>
            <View style={styles.treatmentRow}>
              <Text style={styles.treatmentLabel}>Sala</Text>
              <Text style={styles.treatmentValue}>{treatment.room}</Text>
            </View>
            <View style={styles.treatmentRow}>
              <Text style={styles.treatmentLabel}>Dosis Inicial</Text>
              <Text style={styles.treatmentValue}>{treatment.initialDose} mCi</Text>
            </View>
            <View style={styles.treatmentRow}>
              <Text style={styles.treatmentLabel}>Días de Aislamiento</Text>
              <Text style={styles.treatmentValue}>{treatment.isolationDays} días</Text>
            </View>
            <View style={styles.treatmentRow}>
              <Text style={styles.treatmentLabel}>Estado</Text>
              <Text style={[styles.treatmentValue, treatment.isActive ? styles.activeBadge : styles.inactiveBadge]}>
                {treatment.isActive ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
            <View style={styles.treatmentRow}>
              <Text style={styles.treatmentLabel}>Inicio</Text>
              <Text style={styles.treatmentValue}>{treatment.startDate}</Text>
            </View>
            <View style={styles.treatmentRow}>
              <Text style={styles.treatmentLabel}>Fin</Text>
              <Text style={styles.treatmentValue}>{treatment.endDate}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas Recientes</Text>
        {alerts.length === 0 ? (
          <Text style={styles.emptyText}>No hay alertas</Text>
        ) : (
          alerts.map((alert) => (
            <View key={alert.id} style={[styles.alertCard, alert.alertType === 'warning' && styles.warningAlert]}>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertDate}>{new Date(alert.createdAt).toLocaleDateString('es-ES')}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/health')}>
          <Text style={styles.navIcon}>❤️</Text>
          <Text style={styles.navLabel}>Salud</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/treatment')}>
          <Text style={styles.navIcon}>💊</Text>
          <Text style={styles.navLabel}>Tratamiento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/alerts')}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navLabel}>Alertas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  greeting: { fontSize: 14, color: '#9CA3AF' },
  userName: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 4 },
  logoutButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#1F2937', borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: '#111827', borderRadius: 16, padding: 16, alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 28, fontWeight: '700', color: '#00D9FF', marginVertical: 8 },
  statUnit: { fontSize: 12, color: '#6B7280' },
  treatmentCard: { backgroundColor: '#111827', borderRadius: 16, padding: 20 },
  treatmentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  treatmentLabel: { fontSize: 14, color: '#9CA3AF' },
  treatmentValue: { fontSize: 14, fontWeight: '600', color: '#fff' },
  activeBadge: { color: '#10B981' },
  inactiveBadge: { color: '#EF4444' },
  alertCard: { backgroundColor: '#111827', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#00D9FF' },
  warningAlert: { borderLeftColor: '#F59E0B' },
  alertMessage: { fontSize: 14, color: '#fff', marginBottom: 8 },
  alertDate: { fontSize: 12, color: '#6B7280' },
  emptyText: { color: '#6B7280', fontSize: 14 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#111827', paddingVertical: 16, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: '#1F2937' },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 11, color: '#9CA3AF' },
});