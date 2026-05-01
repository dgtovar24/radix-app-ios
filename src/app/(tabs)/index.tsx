import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { useHealthData } from '../../hooks/useHealthKit';
import { useHealthKitSync } from '../../hooks/useHealthKitSync';
import { patientService, treatmentService, alertService, watchService, messageService, type Treatment, type Alert, type WatchMetrics, type Message } from '../../services/api';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import Badge from '../../components/Badge';
import { ClockIcon, HeartIcon, ActivityIcon, ShieldIcon, BellIcon, PillIcon, MessageIcon, BarChartIcon, WatchIcon, LinkIcon } from '../../components/Icons';

function calculateRemaining(startDate: string, isolationDays: number) {
  const start = new Date(startDate).getTime();
  const end = start + isolationDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const totalMs = end - start;
  const remainingMs = Math.max(0, end - now);
  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const elapsedDays = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  const progress = totalMs > 0 ? Math.min((now - start) / totalMs, 1) : 1;
  return { elapsedDays, days, hours, progress };
}

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [patientId, setPatientId] = useState<number | null>(null);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [alertsCount, setAlertsCount] = useState(0);
  const [latestMetrics, setLatestMetrics] = useState<WatchMetrics | null>(null);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);
  const [token, setToken] = useState('');

  const { bpm: hkBpm, steps: hkSteps, distance: hkDistance, refresh: refreshHealth } = useHealthData();
  useHealthKitSync(!!token);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const t = await SecureStore.getItemAsync('auth_token');
      if (!t) { router.replace('/login'); return; }
      setToken(t);
      const patients = await patientService.getAll(t);
      if (patients.length > 0) {
        const p = patients[0];
        setUserName(p.fullName);
        setPatientId(p.id);
        const [trts, alts, mets, msgs] = await Promise.all([
          treatmentService.getByPatient(p.id, t).catch(() => []),
          alertService.getByPatient(p.id, t).catch(() => []),
          watchService.getLatestByPatient(p.id, t).catch(() => null),
          messageService.getByPatient(p.id, t).catch(() => []),
        ]);
        const trtList = trts as Treatment[];
        const altList = alts as Alert[];
        const msgList = msgs as Message[];
        setTreatment(trtList.find(tr => tr.isActive) || trtList[0] || null);
        setAlertsCount(altList.filter(a => !a.isResolved).length);
        setLatestMetrics(mets as WatchMetrics | null);
        setLastMessage(msgList.length > 0 ? msgList[msgList.length - 1] : null);
      }
    } catch { setUserName('Paciente'); }
  };

  const onRefresh = async () => { setRefreshing(true); await Promise.all([loadAll(), refreshHealth()]); setRefreshing(false); };
  const navigate = (route: string) => router.push(route as any);
  const remaining = treatment ? calculateRemaining(treatment.startDate, treatment.isolationDays) : { elapsedDays: 0, days: 0, hours: 0, progress: 0 };
  const bpm = hkBpm ?? latestMetrics?.bpm ?? 72;
  const steps = hkSteps ?? latestMetrics?.steps ?? 4521;
  const distance = hkDistance ?? latestMetrics?.distance ?? 3.2;
  const radiation = latestMetrics?.currentRadiation ?? 0;
  const motivText = lastMessage?.messageText ?? 'Cada día de aislamiento es un paso hacia tu recuperación. Mantente fuerte.';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}>
      <View style={styles.header}>
        <View><Text style={[styles.greeting, { color: colors.textSecondary }]}>Bienvenido</Text>
        <Text style={[styles.userName, { color: colors.text }]}>{userName || 'Paciente'}</Text></View>
      </View>
      {treatment && (
        <Card style={styles.countdownCard}>
          <View style={styles.cardHeader}><ClockIcon color={colors.primary} size={20} /><Text style={[styles.cardTitle, { color: colors.text }]}>Tiempo de Aislamiento</Text>
          {treatment.isActive && <Badge label="Activo" variant="success" />}</View>
          <Text style={[styles.countdownValue, { color: colors.primary }]}>{remaining.days}d {remaining.hours}h</Text>
          <Text style={[styles.countdownLabel, { color: colors.textSecondary }]}>{remaining.days > 0 ? `${remaining.days} días restantes` : 'Aislamiento completado'}</Text>
          <View style={styles.progressSection}><Text style={[styles.progressText, { color: colors.textSecondary }]}>Día {remaining.elapsedDays + 1} de {treatment.isolationDays}</Text><ProgressBar progress={remaining.progress} /></View>
        </Card>
      )}
      <View style={styles.widgetGrid}>
        <W icon={<ShieldIcon color={colors.primary} size={22} />} label="Radiación" value={`${radiation.toFixed(2)} mSv`} onPress={() => navigate('/(tabs)/radiation-history')} colors={colors} />
        <W icon={<HeartIcon color={colors.error} size={22} />} label="Cardíaco" value={`${Math.round(bpm)} BPM`} onPress={() => navigate('/(tabs)/health-history')} colors={colors} />
        <W icon={<ActivityIcon color={colors.accent} size={22} />} label="Actividad" value={`${steps.toLocaleString()} pasos`} onPress={() => navigate('/(tabs)/health-history')} colors={colors} />
        <W icon={<PillIcon color={colors.success} size={22} />} label="Tratamiento" value={treatment?.isotopeName ?? '-'} onPress={() => navigate('/(tabs)/treatment')} colors={colors} />
        <W icon={<BellIcon color={colors.warning} size={22} />} label="Alertas" value={`${alertsCount} pend.`} onPress={() => navigate('/(tabs)/alerts')} colors={colors} />
        <W icon={<WatchIcon color={colors.primary} size={22} />} label="Dispositivo" value={latestMetrics ? 'Conectado' : 'Sin datos'} onPress={() => navigate('/(tabs)/watch')} colors={colors} />
        <W icon={<BarChartIcon color={colors.success} size={22} />} label="Distancia" value={`${distance.toFixed(1)} km`} onPress={() => navigate('/(tabs)/health-history')} colors={colors} />
        <W icon={<MessageIcon color={colors.accent} size={22} />} label="Médico" value="Contactar" onPress={() => navigate('/(tabs)/contact-doctor')} colors={colors} />
      </View>
      <Card style={styles.motivationCard}>
        <Text style={[styles.motivationIcon, { color: colors.primary }]}>"</Text>
        <Text style={[styles.motivationText, { color: colors.textSecondary }]}>{motivText}</Text>
      </Card>
    </ScrollView>
  );
}

function W({ icon, label, value, onPress, colors }: any) {
  return (<TouchableOpacity onPress={onPress} activeOpacity={0.7} style={wstyles.wrap}><Card style={wstyles.card}>{icon}<Text style={[wstyles.l, { color: colors.textSecondary }]}>{label}</Text><Text style={[wstyles.v, { color: colors.text }]} numberOfLines={1}>{value}</Text></Card></TouchableOpacity>);
}

const styles = StyleSheet.create({ container: { flex: 1 }, content: { padding: 24, paddingTop: 60, paddingBottom: 32 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }, greeting: { fontSize: 14 }, userName: { fontSize: 24, fontWeight: '700', marginTop: 4 }, cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }, cardTitle: { fontSize: 15, fontWeight: '600', flex: 1 }, countdownCard: { padding: 24, marginBottom: 20 }, countdownValue: { fontSize: 28, fontWeight: '700', marginBottom: 4 }, countdownLabel: { fontSize: 13, marginBottom: 16 }, progressSection: { gap: 6 }, progressText: { fontSize: 12, fontWeight: '500' }, widgetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }, motivationCard: { padding: 20, flexDirection: 'row', gap: 12, alignItems: 'flex-start' }, motivationIcon: { fontSize: 32, fontWeight: '800', lineHeight: 32, marginTop: -4 }, motivationText: { fontSize: 14, fontStyle: 'italic', lineHeight: 20, flex: 1 } });
const wstyles = StyleSheet.create({ wrap: { width: '47%' as any }, card: { padding: 16, gap: 8, alignItems: 'flex-start' }, l: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }, v: { fontSize: 14, fontWeight: '500' } });
