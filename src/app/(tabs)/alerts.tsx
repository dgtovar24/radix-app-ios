import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useThemeColors } from '../../theme/useThemeColor';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

interface AlertItem {
  id: string;
  type: 'RADIATION_HIGH' | 'BPM_IRREGULAR' | 'LOW_ACTIVITY' | 'OUT_OF_ZONE' | 'INFO';
  message: string;
  isResolved: boolean;
  createdAt: string;
}

const MOCK_ALERTS: AlertItem[] = [
  {
    id: '1',
    type: 'INFO',
    message: 'Niveles de radiación dentro del umbral seguro',
    isResolved: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    type: 'RADIATION_HIGH',
    message: 'Pico de radiación detectado a las 14:32',
    isResolved: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    type: 'BPM_IRREGULAR',
    message: 'Ritmo cardíaco irregular detectado durante 5 minutos',
    isResolved: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    type: 'LOW_ACTIVITY',
    message: 'Actividad física por debajo del mínimo recomendado hoy',
    isResolved: false,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: '5',
    type: 'INFO',
    message: 'Recuerda tomar tu medicación a las 20:00',
    isResolved: false,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '6',
    type: 'OUT_OF_ZONE',
    message: 'Salida de la zona de seguridad detectada',
    isResolved: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

type FilterType = 'all' | 'pending' | 'resolved';

const typeLabels: Record<AlertItem['type'], string> = {
  RADIATION_HIGH: 'Radiación Alta',
  BPM_IRREGULAR: 'Ritmo Irregular',
  LOW_ACTIVITY: 'Baja Actividad',
  OUT_OF_ZONE: 'Fuera de Zona',
  INFO: 'Informativo',
};

const typeBadgeVariant: Record<AlertItem['type'], 'error' | 'warning' | 'primary'> = {
  RADIATION_HIGH: 'error',
  BPM_IRREGULAR: 'warning',
  LOW_ACTIVITY: 'warning',
  OUT_OF_ZONE: 'error',
  INFO: 'primary',
};

export default function AlertsScreen() {
  const colors = useThemeColors();
  const [filter, setFilter] = useState<FilterType>('all');
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);

  const filtered = alerts.filter((a) => {
    if (filter === 'pending') return !a.isResolved;
    if (filter === 'resolved') return a.isResolved;
    return true;
  });

  const toggleResolved = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isResolved: !a.isResolved } : a))
    );
  };

  const renderAlert = ({ item }: { item: AlertItem }) => (
    <Card style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <Badge label={typeLabels[item.type]} variant={typeBadgeVariant[item.type]} />
        <TouchableOpacity
          onPress={() => toggleResolved(item.id)}
          style={[
            styles.resolveButton,
            {
              backgroundColor: item.isResolved
                ? colors.success + '20'
                : colors.textSecondary + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.resolveText,
              {
                color: item.isResolved ? colors.success : colors.textSecondary,
              },
            ]}
          >
            {item.isResolved ? 'Resuelta' : 'Pendiente'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.alertMessage, { color: colors.text }]}>
        {item.message}
      </Text>
      <Text style={[styles.alertTime, { color: colors.textSecondary }]}>
        {new Date(item.createdAt).toLocaleString('es-ES', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filterRow}>
        {(['all', 'pending', 'resolved'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f ? colors.primary : colors.surface,
                borderColor: filter === f ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === f ? '#FFFFFF' : colors.textSecondary,
                },
              ]}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Resueltas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            No hay alertas
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  list: { paddingHorizontal: 24, paddingBottom: 24 },
  alertCard: { padding: 16, marginBottom: 12 },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resolveButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resolveText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  alertTime: {
    fontSize: 12,
    fontFamily: 'Inter',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    fontFamily: 'Inter',
  },
});
