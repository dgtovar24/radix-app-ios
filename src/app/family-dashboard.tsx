import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useThemeColors } from '../theme/useThemeColor';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import RadiationGauge from '../components/RadiationGauge';
import {
  ClockIcon,
  ShieldIcon,
  UserIcon,
  InfoIcon,
  ArrowLeftIcon,
} from '../components/Icons';

function calculateRemaining(startDate: string, isolationDays: number) {
  const start = new Date(startDate).getTime();
  const end = start + isolationDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const totalMs = end - start;
  const remainingMs = Math.max(0, end - now);

  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  const elapsedDays = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  const progress = totalMs > 0 ? Math.min((now - start) / totalMs, 1) : 1;

  return { elapsedDays, remainingMs, days, hours, minutes, progress };
}

const MOCK_FAMILY_PATIENT = {
  fullName: 'María García López',
  isolationStartDate: '2026-04-22',
  isolationDays: 14,
  currentRadiation: 0.08,
  admissionDate: '2026-04-21',
};

export default function FamilyDashboardScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();
  const colors = useThemeColors();
  const patient = MOCK_FAMILY_PATIENT;

  const remaining = useMemo(
    () => calculateRemaining(patient.isolationStartDate, patient.isolationDays),
    [patient.isolationStartDate, patient.isolationDays]
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ArrowLeftIcon color={colors.primary} size={24} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <UserIcon color="#FFFFFF" size={28} />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {patient.fullName}
        </Text>
        <Badge label="En Confinamiento" variant="success" />
        <View style={{ height: 8 }} />
        <Badge label="Demostración" variant="warning" />
      </View>

      <Card style={styles.countdownCard}>
        <View style={styles.cardHeader}>
          <ClockIcon color={colors.primary} size={20} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Tiempo de Aislamiento
          </Text>
        </View>

        <Text style={[styles.countdownValue, { color: colors.primary }]}>
          {remaining.days}d {remaining.hours}h {remaining.minutes}m
        </Text>
        <Text style={[styles.countdownLabel, { color: colors.textSecondary }]}>
          Día {remaining.elapsedDays + 1} de {patient.isolationDays}
        </Text>
        <ProgressBar progress={remaining.progress} />
      </Card>

      <Card style={styles.radiationCard}>
        <View style={styles.cardHeader}>
          <ShieldIcon color={colors.primary} size={20} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Nivel de Radiación
          </Text>
        </View>
        <View style={styles.gaugeCenter}>
          <RadiationGauge
            value={patient.currentRadiation}
            maxValue={1}
            size={150}
            strokeWidth={10}
          />
        </View>
      </Card>

      <Card style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Fecha de Ingreso
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {new Date(patient.admissionDate).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </Card>

      <Card style={styles.warningCard}>
        <InfoIcon color={colors.warning} size={22} />
        <Text style={[styles.warningText, { color: colors.text }]}>
          El paciente debe mantener el aislamiento durante el tiempo estipulado.
          No se permite contacto físico directo.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 16, paddingBottom: 40 },
  backButton: { padding: 8, marginBottom: 8 },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginTop: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  countdownCard: { padding: 20, marginBottom: 16 },
  countdownValue: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  countdownLabel: {
    fontSize: 13,
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  radiationCard: { padding: 20, marginBottom: 16 },
  gaugeCenter: { alignItems: 'center' },
  infoRow: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Inter',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  warningCard: {
    padding: 20,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontFamily: 'Inter',
  },
});
