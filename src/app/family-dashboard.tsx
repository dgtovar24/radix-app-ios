import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeColors } from '../theme/useThemeColor';
import { patientService, watchService, type Patient, type WatchMetrics } from '../services/api';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import RadiationGauge from '../components/RadiationGauge';
import { ClockIcon, ShieldIcon } from '../components/Icons';

export default function FamilyDashboard() {
  const colors = useThemeColors();
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [metrics, setMetrics] = useState<WatchMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!code.trim()) return;
    setLoading(true); setError('');
    try {
      const patients = await patientService.getAll('');
      const found = patients.find(p => p.familyAccessCode === code.trim());
      if (!found) { setError('Código no encontrado'); setPatient(null); return; }
      setPatient(found);
      setSubmitted(true);
      try { const m = await watchService.getLatestByPatient(found.id, ''); setMetrics(m); } catch {}
    } catch { setError('Error de conexión'); }
    finally { setLoading(false); }
  };

  const radiation = metrics?.currentRadiation ?? 0;

  if (!submitted) {
    return (
      <View style={[styles.c, { backgroundColor: colors.background, justifyContent:'center', padding:24 }]}>
        <Text style={{ color: colors.text, fontSize:22, fontWeight:'700', textAlign:'center', marginBottom:8 }}>Acceso Familiar</Text>
        <Text style={{ color: colors.textSecondary, fontSize:14, textAlign:'center', marginBottom:24 }}>Ingresa el código de acceso familiar del paciente</Text>
        <TextInput style={[styles.inp, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]} placeholder="Código de acceso (ej: FAM-0001)" placeholderTextColor={colors.textSecondary} value={code} onChangeText={setCode} autoCapitalize="characters" />
        <TouchableOpacity onPress={handleSearch} disabled={loading} style={[styles.btn, { backgroundColor: colors.primary }]}>{loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color:'#fff', fontWeight:'700', fontSize:16 }}>Ver Paciente</Text>}</TouchableOpacity>
        {error ? <Text style={{ color: colors.error, textAlign:'center', marginTop:12 }}>{error}</Text> : null}
      </View>
    );
  }

  if (!patient) return null;

  return (
    <ScrollView style={[styles.c, { backgroundColor: colors.background }]} contentContainerStyle={styles.cont}>
      <Text style={{ color: colors.text, fontSize:24, fontWeight:'700', marginBottom:4 }}>{patient.fullName}</Text>
      <Text style={{ color: colors.textSecondary, fontSize:14, marginBottom:24 }}>Código: {patient.familyAccessCode}</Text>

      <Card style={{ padding: 20, marginBottom: 16, alignItems: 'center' }}>
        <RadiationGauge value={Math.min(radiation * 7, 100)} maxValue={100} size={140} />
        <Text style={{ color: colors.text, fontSize:28, fontWeight:'800', marginTop:12 }}>{radiation.toFixed(2)} mSv</Text>
        <Text style={{ color: colors.textSecondary, fontSize:13 }}>Radiación actual</Text>
      </Card>

      {metrics && (
        <Card style={{ padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection:'row', justifyContent:'space-around' }}>
            <View style={{ alignItems:'center' }}><Text style={{ color: colors.text, fontSize:20, fontWeight:'700' }}>{metrics.bpm ?? '-'}</Text><Text style={{ color: colors.textSecondary, fontSize:12 }}>BPM</Text></View>
            <View style={{ alignItems:'center' }}><Text style={{ color: colors.text, fontSize:20, fontWeight:'700' }}>{metrics.steps ?? '-'}</Text><Text style={{ color: colors.textSecondary, fontSize:12 }}>Pasos</Text></View>
            <View style={{ alignItems:'center' }}><Text style={{ color: colors.text, fontSize:20, fontWeight:'700' }}>{metrics.distance?.toFixed(1) ?? '-'}</Text><Text style={{ color: colors.textSecondary, fontSize:12 }}>km</Text></View>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ c:{flex:1}, cont:{padding:24,paddingBottom:40}, inp:{borderWidth:1,borderRadius:14,padding:16,fontSize:16,marginBottom:16}, btn:{padding:16,borderRadius:14,alignItems:'center'} });
