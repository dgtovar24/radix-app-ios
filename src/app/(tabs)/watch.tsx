import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useThemeColors } from '../../theme/useThemeColor';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import ProgressBar from '../../components/ProgressBar';
import StatusDot from '../../components/StatusDot';
import {
  WatchIcon,
  BatteryIcon,
  BluetoothIcon,
  SignalIcon,
} from '../../components/Icons';

const MOCK_DEVICE = {
  model: 'Radix Watch Pro',
  imei: 'RW-2026-00142',
  connected: true,
  batteryPercent: 78,
  batteryHoursRemaining: 18,
  bluetoothStatus: 'connected' as const,
  signalStrength: 3, // 0-4
};

export default function WatchScreen() {
  const colors = useThemeColors();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <WatchIcon color={colors.primary} size={28} />
        <Text style={[styles.title, { color: colors.text }]}>
          {MOCK_DEVICE.model}
        </Text>
        <View style={styles.statusRow}>
          <StatusDot status={MOCK_DEVICE.connected ? 'active' : 'inactive'} />
          <Text style={[styles.statusText, { color: colors.success }]}>
            Conectado
          </Text>
        </View>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Modelo
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {MOCK_DEVICE.model}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            IMEI
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {MOCK_DEVICE.imei}
          </Text>
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Batería
      </Text>
      <Card style={styles.batteryCard}>
        <View style={styles.row}>
          <BatteryIcon color={colors.primary} size={22} />
          <View style={styles.batteryInfo}>
            <View style={styles.batteryHeader}>
              <Text style={[styles.batteryPercent, { color: colors.text }]}>
                {MOCK_DEVICE.batteryPercent}%
              </Text>
              <Badge
                label={`~${MOCK_DEVICE.batteryHoursRemaining}h restantes`}
                variant={MOCK_DEVICE.batteryPercent > 20 ? 'primary' : 'warning'}
              />
            </View>
            <ProgressBar
              progress={MOCK_DEVICE.batteryPercent / 100}
              color={
                MOCK_DEVICE.batteryPercent > 50
                  ? colors.success
                  : MOCK_DEVICE.batteryPercent > 20
                  ? colors.warning
                  : colors.error
              }
            />
          </View>
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Conectividad
      </Text>
      <Card style={styles.connectivityCard}>
        <View style={styles.connectRow}>
          <BluetoothIcon
            color={
              MOCK_DEVICE.bluetoothStatus === 'connected'
                ? colors.success
                : colors.textSecondary
            }
            size={20}
          />
          <Text style={[styles.connectLabel, { color: colors.text }]}>
            Bluetooth
          </Text>
          <View style={styles.connectRight}>
            <StatusDot
              status={
                MOCK_DEVICE.bluetoothStatus === 'connected' ? 'active' : 'inactive'
              }
            />
            <Text
              style={[
                styles.connectValue,
                {
                  color:
                    MOCK_DEVICE.bluetoothStatus === 'connected'
                      ? colors.success
                      : colors.textSecondary,
                },
              ]}
            >
              {MOCK_DEVICE.bluetoothStatus === 'connected'
                ? 'Conectado'
                : 'Desconectado'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.connectRow}>
          <SignalIcon color={colors.textSecondary} size={20} />
          <Text style={[styles.connectLabel, { color: colors.text }]}>
            Señal
          </Text>
          <View style={styles.signalBars}>
            {[1, 2, 3, 4].map((bar) => (
              <View
                key={bar}
                style={[
                  styles.signalBar,
                  {
                    backgroundColor:
                      bar <= MOCK_DEVICE.signalStrength
                        ? colors.primary
                        : colors.border,
                    height: bar * 6 + 4,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 16 },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  infoCard: { padding: 20, marginBottom: 24 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  batteryCard: { padding: 20, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  batteryInfo: { flex: 1, gap: 10 },
  batteryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  batteryPercent: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  connectivityCard: { padding: 20, marginBottom: 24 },
  connectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  connectLabel: {
    fontSize: 15,
    flex: 1,
    fontFamily: 'Inter',
  },
  connectRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  signalBar: {
    width: 6,
    borderRadius: 2,
  },
});
