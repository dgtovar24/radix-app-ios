import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeColors } from '../../theme/useThemeColor';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import StatusDot from '../../components/StatusDot';
import { ShieldIcon, ClockIcon } from '../../components/Icons';

const MOCK_TREATMENT = {
  isotopeName: 'I-131',
  isotopeFullName: 'Iodine-131',
  isotopeSymbol: 'I',
  isotopeHalfLife: 8.02,
  isotopeUnit: 'días',
  initialDose: 150,
  safetyThreshold: 200,
  room: 101,
  startDate: '2026-04-22',
  endDate: '2026-05-06',
  isolationDays: 14,
  isActive: true,
};

function calculateRemaining(startDate: string, isolationDays: number) {
  const start = new Date(startDate).getTime();
  const end = start + isolationDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const remainingMs = Math.max(0, end - now);
  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const elapsedDays = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  return { days, hours, elapsedDays };
}

export default function TreatmentDetailScreen() {
  const colors = useThemeColors();
  const t = MOCK_TREATMENT;
  const remaining = calculateRemaining(t.startDate, t.isolationDays);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.statusBanner, { backgroundColor: colors.success + '18' }]}>
        <StatusDot status="active" size={10} />
        <Text style={[styles.statusText, { color: colors.success }]}>
          Tratamiento Activo
        </Text>
        <Badge label={`Día ${remaining.elapsedDays + 1}`} variant="primary" />
      </View>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <ShieldIcon color={colors.primary} size={20} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Radioisótopo
          </Text>
        </View>
        <View style={styles.isotopeHighlight}>
          <Text style={[styles.isotopeSymbol, { color: colors.primary }]}>
            {t.isotopeSymbol}
          </Text>
          <View>
            <Text style={[styles.isotopeName, { color: colors.text }]}>
              {t.isotopeFullName}
            </Text>
            <Text style={[styles.isotopeDetail, { color: colors.textSecondary }]}>
              Vida media: {t.isotopeHalfLife} {t.isotopeUnit}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.smallTitle, { color: colors.textSecondary }]}>
          DOSIFICACIÓN
        </Text>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
              Dosis Inicial
            </Text>
            <Text style={[styles.rowValue, { color: colors.text }]}>
              {t.initialDose} mCi
            </Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.rowItem}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
              Umbral Seguridad
            </Text>
            <Text style={[styles.rowValue, { color: colors.text }]}>
              {t.safetyThreshold} mSv
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <ClockIcon color={colors.primary} size={20} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Aislamiento
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
              Duración Total
            </Text>
            <Text style={[styles.rowValue, { color: colors.text }]}>
              {t.isolationDays} días
            </Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.rowItem}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
              Restante
            </Text>
            <Text style={[styles.rowValue, { color: colors.primary }]}>
              {remaining.days}d {remaining.hours}h
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.smallTitle, { color: colors.textSecondary }]}>
          INFORMACIÓN GENERAL
        </Text>
        <InfoRow label="Habitación" value={`Sala ${t.room}`} colors={colors} />
        <InfoRow label="Fecha de Inicio" value={new Date(t.startDate).toLocaleDateString('es-ES')} colors={colors} last />
        <InfoRow label="Fecha de Fin" value={new Date(t.endDate).toLocaleDateString('es-ES')} colors={colors} last />
      </Card>

      <Card style={[styles.noteCard, { backgroundColor: colors.warning + '14' }]}>
        <Text style={[styles.noteText, { color: colors.textSecondary }]}>
          Durante el periodo de aislamiento, evita el contacto físico cercano con
          otras personas. Sigue las indicaciones de tu médico en todo momento.
        </Text>
      </Card>
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useThemeColors>;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && styles.infoRowBorder,
        !last && { borderBottomColor: colors.border },
      ]}
    >
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 10,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    fontFamily: 'Inter',
  },
  section: { padding: 20, marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  isotopeHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  isotopeSymbol: {
    fontSize: 42,
    fontWeight: '800',
    fontFamily: 'Inter',
  },
  isotopeName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  isotopeDetail: {
    fontSize: 14,
    fontFamily: 'Inter',
  },
  smallTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowItem: {
    flex: 1,
    gap: 4,
  },
  rowDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 16,
  },
  rowLabel: {
    fontSize: 13,
    fontFamily: 'Inter',
  },
  rowValue: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  noteCard: {
    padding: 18,
    borderRadius: 14,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
});
