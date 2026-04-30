import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { alertService, patientService, type Alert } from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

type FilterType = 'all' | 'pending' | 'resolved';

const typeLabels: Record<string, string> = { RADIATION_HIGH: 'Radiación Alta', BPM_IRREGULAR: 'Ritmo Irregular', LOW_ACTIVITY: 'Baja Actividad', OUT_OF_ZONE: 'Fuera de Zona', DEVICE_OFFLINE: 'Sin Dispositivo', INFO: 'Informativo' };
const typeVariant: Record<string, 'error'|'warning'|'primary'> = { RADIATION_HIGH: 'error', BPM_IRREGULAR: 'warning', LOW_ACTIVITY: 'warning', OUT_OF_ZONE: 'error', DEVICE_OFFLINE: 'warning', INFO: 'primary' };

export default function AlertsScreen() {
  const colors = useThemeColors();
  const [filter, setFilter] = useState<FilterType>('all');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    try {
      const t = await SecureStore.getItemAsync('auth_token');
      if (!t) return;
      const patients = await patientService.getAll(t);
      if (patients.length > 0) {
        const data = await alertService.getByPatient(patients[0].id, t);
        setAlerts(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleResolve = async (alertId: number) => {
    try {
      const t = await SecureStore.getItemAsync('auth_token');
      if (!t) return;
      await alertService.resolve(alertId, t);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isResolved: true } : a));
    } catch {}
  };

  const filtered = alerts.filter(a => {
    if (filter === 'pending') return !a.isResolved;
    if (filter === 'resolved') return a.isResolved;
    return true;
  });

  if (loading) return <View style={[styles.container, { backgroundColor: colors.background }, styles.centered]}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filterRow}>
        {(['all','pending','resolved'] as FilterType[]).map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.chip, { backgroundColor: filter===f ? colors.primary : colors.surface, borderColor: filter===f ? colors.primary : colors.border }]}>
            <Text style={[styles.chipText, { color: filter===f ? '#FFF' : colors.textSecondary }]}>{f==='all'?'Todas':f==='pending'?'Pendientes':'Resueltas'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={filtered} keyExtractor={a => String(a.id)} contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Badge label={typeLabels[item.alertType] ?? item.alertType} variant={typeVariant[item.alertType] ?? 'primary'} />
              {!item.isResolved && (
                <TouchableOpacity onPress={() => handleResolve(item.id)} style={[styles.btn, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.btnt, { color: colors.primary }]}>Resolver</Text>
                </TouchableOpacity>
              )}
              {item.isResolved && <Badge label="Resuelta" variant="success" />}
            </View>
            <Text style={[styles.msg, { color: colors.text }]}>{item.message}</Text>
            <Text style={[styles.time, { color: colors.textSecondary }]}>{new Date(item.createdAt).toLocaleString('es-ES', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</Text>
          </Card>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.textSecondary }]}>No hay alertas</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, centered: { justifyContent:'center', alignItems:'center' },
  filterRow: { flexDirection:'row', paddingHorizontal:24, paddingTop:16, paddingBottom:12, gap:8 },
  chip: { paddingHorizontal:16, paddingVertical:8, borderRadius:24, borderWidth:1 },
  chipText: { fontSize:13, fontWeight:'600' },
  list: { paddingHorizontal:24, paddingBottom:24 },
  card: { padding:16, marginBottom:12 },
  row: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  btn: { paddingHorizontal:12, paddingVertical:4, borderRadius:12 },
  btnt: { fontSize:12, fontWeight:'600' },
  msg: { fontSize:14, lineHeight:20, marginBottom:8 },
  time: { fontSize:12 },
  empty: { textAlign:'center', marginTop:40, fontSize:14 },
});
