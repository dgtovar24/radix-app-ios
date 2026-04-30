import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { patientService, radiationLogService, type RadiationLog } from '../../services/api';
import { LineChart } from '../../components/Charts';
import Card from '../../components/Card';

const W = Dimensions.get('window').width;

export default function RadiationHistoryScreen() {
  const colors = useThemeColors();
  const [logs, setLogs] = useState<RadiationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const t = await SecureStore.getItemAsync('auth_token'); if (!t) return;
      const patients = await patientService.getAll(t);
      if (patients.length > 0) {
        const l = await radiationLogService.getByPatient(patients[0].id, 14, t);
        setLogs(l);
      }
    } catch {} finally { setLoading(false); }
  };

  const chartData = logs.map(l => ({ label: new Date(l.timestamp).toLocaleDateString('es',{weekday:'short'}), value: l.radiationLevel }));
  const current = logs.length > 0 ? logs[0].radiationLevel : 0;

  if (loading) return <View style={[styles.c, { backgroundColor: colors.background, justifyContent:'center', alignItems:'center' }]}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <ScrollView style={[styles.c, { backgroundColor: colors.background }]} contentContainerStyle={styles.cont}>
      <Card style={{ padding: 20, marginBottom: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8 }}>Radiación Actual</Text>
        <Text style={{ fontSize: 36, fontWeight: '800', color: colors.primary }}>{current.toFixed(2)}</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>mSv</Text>
      </Card>
      <Text style={[styles.title, { color: colors.text }]}>Historial de Radiación</Text>
      <View style={styles.chart}>{chartData.length > 0 ? <LineChart data={chartData} width={W - 72} height={180} color={colors.error} /> : <Text style={{ color: colors.textSecondary }}>Sin datos</Text>}</View>
      {logs.slice(0, 7).map((l, i) => (
        <View key={i} style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={{ color: colors.text }}>{new Date(l.timestamp).toLocaleDateString('es',{weekday:'long',day:'numeric',month:'short'})}</Text>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{l.radiationLevel.toFixed(2)} mSv</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ c:{flex:1}, cont:{padding:24,paddingBottom:40}, title:{fontSize:16,fontWeight:'600',marginBottom:12}, chart:{height:180,borderRadius:14,backgroundColor:'rgba(0,0,0,0.03)',padding:12,marginBottom:20}, row:{flexDirection:'row',justifyContent:'space-between',paddingVertical:12,borderBottomWidth:1} });
