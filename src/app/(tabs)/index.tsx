import { useState, useEffect, useMemo } from 'react';
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
import { useThemeColors } from '../../theme/useThemeColor';
import { useHealthData } from '../../hooks/useHealthKit';
import { patientService } from '../../services/api';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import Badge from '../../components/Badge';
import RadiationGauge from '../../components/RadiationGauge';
import {
  ClockIcon,
  HeartIcon,
  ActivityIcon,
  ShieldIcon,
  LogoutIcon,
  BellIcon,
  PillIcon,
  MessageIcon,
  BarChartIcon,
  WatchIcon,
  LinkIcon,
} from '../../components/Icons';

interface TreatmentData {
  room: number;
  startDate: string;
  isolationDays: number;
  isActive: boolean;
  isotopeName: string;
  initialDose: number;
  safetyThreshold: number;
}

function calculateRemaining(startDate: string, isolationDays: number) {
  const start = new Date(startDate).getTime();
  const end = start + isolationDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const totalMs = end - start;
  const remainingMs = Math.max(0, end - now);
  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  const elapsedDays = Math.floor((Date.now() - start) / (24 * 60 * 60 * 1000));
  const progress = totalMs > 0 ? Math.min((now - start) / totalMs, 1) : 1;
  return { elapsedDays, days, hours, minutes, progress };
}

const MOCK_TREATMENT: TreatmentData = {
  room: 101,
  startDate: '2026-04-22',
  isolationDays: 14,
  isActive: true,
  isotopeName: 'I-131',
  initialDose: 150,
  safetyThreshold: 200,
};

const MOCK_RADIATION = 0.08;

const MOCK_MESSAGE =
  'Cada día de aislamiento es un paso hacia tu recuperación. Mantente fuerte.';

const MOCK_ALERTS_PENDING = 1;

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  const treatment = MOCK_TREATMENT;
  const remaining = useMemo(
    () => calculateRemaining(treatment.startDate, treatment.isolationDays),
    []
  );

  const { bpm: hkBpm, steps: hkSteps, distance: hkDistance, available: hkAvailable, refresh: refreshHealth } = useHealthData();

  const bpm = hkBpm ?? 72;
  const steps = hkSteps ?? 4521;
  const distance = hkDistance ?? 3.2;

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) { router.replace('/login'); return; }
      const userId = await SecureStore.getItemAsync('user_id');
      if (userId) {
        try {
          const patients = await patientService.getAll(token);
          if (patients.length > 0) setUserName(patients[0].fullName);
        } catch { setUserName('Paciente'); }
      }
    } catch { setUserName('Paciente'); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadDashboard(), refreshHealth()]);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_id');
    await SecureStore.deleteItemAsync('user_role');
    router.replace('/login');
  };

  const navigate = (route: string) => router.push(route as any);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Bienvenido</Text>
          <Text style={[styles.userName, { color: colors.text }]}>{userName || 'Paciente'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogoutIcon color={colors.error} size={20} />
        </TouchableOpacity>
      </View>

      <Card style={styles.countdownCard}>
        <View style={styles.cardHeader}>
          <ClockIcon color={colors.primary} size={20} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Tiempo de Aislamiento</Text>
          {treatment.isActive && <Badge label="Activo" variant="success" />}
        </View>
        <Text style={[styles.countdownValue, { color: colors.primary }]}>
          {remaining.days}d {remaining.hours}h {remaining.minutes}m
        </Text>
        <Text style={[styles.countdownLabel, { color: colors.textSecondary }]}>
          {remaining.days > 0 ? `${remaining.days} días restantes` : 'Aislamiento completado'}
        </Text>
        <View style={styles.progressSection}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            Día {remaining.elapsedDays + 1} de {treatment.isolationDays}
          </Text>
          <ProgressBar progress={remaining.progress} />
        </View>
      </Card>

      <View style={styles.widgetGrid}>
        <Widget
          icon={<ShieldIcon color={colors.primary} size={22} />}
          label="Radiación"
          value={`${MOCK_RADIATION} mSv`}
          onPress={() => navigate('/(tabs)/radiation-history')}
          colors={colors}
        />
        <Widget
          icon={<HeartIcon color={colors.error} size={22} />}
          label="Cardíaco"
          value={`${Math.round(bpm)} BPM`}
          onPress={() => navigate('/(tabs)/health-history')}
          colors={colors}
        />
        <Widget
          icon={<ActivityIcon color={colors.accent} size={22} />}
          label="Actividad"
          value={`${steps.toLocaleString()} pasos`}
          onPress={() => navigate('/(tabs)/health-history')}
          colors={colors}
        />
        <Widget
          icon={<PillIcon color={colors.success} size={22} />}
          label="Tratamiento"
          value={treatment.isotopeName}
          onPress={() => navigate('/(tabs)/treatment')}
          colors={colors}
        />
        <Widget
          icon={<BellIcon color={colors.warning} size={22} />}
          label="Alertas"
          value={`${MOCK_ALERTS_PENDING} pendientes`}
          onPress={() => navigate('/(tabs)/alerts')}
          colors={colors}
        />
        <Widget
          icon={<WatchIcon color={colors.primary} size={22} />}
          label="Dispositivo"
          value="Conectado"
          onPress={() => navigate('/(tabs)/watch')}
          colors={colors}
        />
        <Widget
          icon={<BarChartIcon color={colors.success} size={22} />}
          label="Distancia"
          value={`${distance.toFixed(1)} km`}
          onPress={() => navigate('/(tabs)/health-history')}
          colors={colors}
        />
        <Widget
          icon={<MessageIcon color={colors.accent} size={22} />}
          label="Médico"
          value="Contactar"
          onPress={() => navigate('/(tabs)/contact-doctor')}
          colors={colors}
        />
        <Widget
          icon={<LinkIcon color={colors.primary} size={22} />}
          label="Conexiones"
          value="8 plataformas"
          onPress={() => navigate('/(tabs)/connections')}
          colors={colors}
        />
      </View>

      <Card style={styles.motivationCard}>
        <Text style={[styles.motivationIcon, { color: colors.primary }]}>"</Text>
        <Text style={[styles.motivationText, { color: colors.textSecondary }]}>{MOCK_MESSAGE}</Text>
      </Card>
    </ScrollView>
  );
}

function Widget({
  icon,
  label,
  value,
  onPress,
  colors,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress: () => void;
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.widgetWrapper}>
      <Card style={styles.widgetCard}>
        {icon}
        <Text style={[styles.widgetLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.widgetValue, { color: colors.text }]} numberOfLines={1}>{value}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, fontFamily: 'Inter' },
  userName: { fontSize: 24, fontWeight: '700', marginTop: 4, fontFamily: 'Inter' },
  logoutButton: { padding: 8, borderRadius: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', flex: 1, fontFamily: 'Inter' },
  countdownCard: { padding: 24, marginBottom: 20 },
  countdownValue: { fontSize: 28, fontWeight: '700', fontFamily: 'Inter', marginBottom: 4 },
  countdownLabel: { fontSize: 13, fontFamily: 'Inter', marginBottom: 16 },
  progressSection: { gap: 6 },
  progressText: { fontSize: 12, fontWeight: '500', fontFamily: 'Inter' },
  widgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  widgetWrapper: { width: '47%' as any },
  widgetCard: {
    padding: 16,
    gap: 8,
    alignItems: 'flex-start',
  },
  widgetLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Inter' },
  widgetValue: { fontSize: 14, fontWeight: '500', fontFamily: 'Inter' },
  motivationCard: { padding: 20, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  motivationIcon: { fontSize: 32, fontWeight: '800', lineHeight: 32, fontFamily: 'Inter', marginTop: -4 },
  motivationText: { fontSize: 14, fontStyle: 'italic', lineHeight: 20, flex: 1, fontFamily: 'Inter' },
});
