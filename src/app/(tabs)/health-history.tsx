import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { patientService, healthMetricsService, type HealthMetric } from '../../services/api';
import { useHealthHistory } from '../../hooks/useHealthKit';
import { BarChart, LineChart } from '../../components/Charts';

const { width: W } = Dimensions.get('window');

export default function HealthHistoryScreen() {
  const colors = useThemeColors();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { heartRate: hkHeart, steps: hkSteps, loading: hkLoading } = useHealthHistory(7);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const t = await SecureStore.getItemAsync('auth_token'); if (!t) return;
      const patients = await patientService.getAll(t);
      if (patients.length > 0) {
        const m = await healthMetricsService.getByPatient(patients[0].id, 7, t);
        setMetrics(m);
      }
    } catch {} finally { setLoading(false); }
  };

  const bpmData = metrics.map(m => ({ label: new Date(m.recordedAt).toLocaleDateString('es',{weekday:'short'}), value: m.bpm ?? 0 }));
  const stepsData = metrics.map(m => ({ label: new Date(m.recordedAt).toLocaleDateString('es',{weekday:'short'}), value: m.steps ?? 0 }));
  const distData = metrics.map(m => ({ label: new Date(m.recordedAt).toLocaleDateString('es',{weekday:'short'}), value: (m.distance ?? 0) }));

  if (loading) return <View style={[styles.c, { backgroundColor: colors.background, justifyContent:'center', alignItems:'center' }]}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <ScrollView style={[styles.c, { backgroundColor: colors.background }]} contentContainerStyle={styles.cont}>
      <Text style={[styles.title, { color: colors.text }]}>Frecuencia Cardíaca</Text>
      <View style={styles.chart}>{bpmData.length > 0 ? <LineChart data={bpmData} width={W - 72} height={180} color={colors.error} /> : <Text style={{ color: colors.textSecondary }}>Sin datos</Text>}</View>
      <Text style={[styles.title, { color: colors.text }]}>Pasos Diarios</Text>
      <View style={styles.chart}>{stepsData.length > 0 ? <BarChart data={stepsData} width={W - 72} height={180} color={colors.primary} /> : <Text style={{ color: colors.textSecondary }}>Sin datos</Text>}</View>
      <Text style={[styles.title, { color: colors.text }]}>Distancia (km)</Text>
      <View style={styles.chart}>{distData.length > 0 ? <BarChart data={distData} width={W - 72} height={180} color={colors.success} /> : <Text style={{ color: colors.textSecondary }}>Sin datos</Text>}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ c:{flex:1}, cont:{padding:24,paddingBottom:40}, title:{fontSize:16,fontWeight:'600',marginBottom:12,marginTop:20}, chart:{height:180,borderRadius:14,backgroundColor:'rgba(0,0,0,0.03)',padding:12} });
