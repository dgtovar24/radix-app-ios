import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { patientService, smartwatchService, type Smartwatch } from '../../services/api';
import Card from '../../components/Card';
import StatusDot from '../../components/StatusDot';
import { WatchIcon } from '../../components/Icons';

export default function WatchScreen() {
  const colors = useThemeColors();
  const [devices, setDevices] = useState<Smartwatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const t = await SecureStore.getItemAsync('auth_token'); if (!t) return;
      const patients = await patientService.getAll(t);
      if (patients.length > 0) {
        const sws = await smartwatchService.getByPatient(patients[0].id, t);
        setDevices(sws);
      }
    } catch {} finally { setLoading(false); }
  };

  if (loading) return <View style={[styles.c, { backgroundColor: colors.background, justifyContent:'center', alignItems:'center' }]}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <View style={[styles.c, { backgroundColor: colors.background }]}>
      {devices.length === 0 ? (
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:40 }}>
          <WatchIcon color={colors.textSecondary} size={48} />
          <Text style={{ color: colors.textSecondary, fontSize:16, fontWeight:'600', marginTop:16 }}>Sin dispositivos vinculados</Text>
        </View>
      ) : devices.map(d => (
        <Card key={d.id} style={styles.card}>
          <View style={{ flexDirection:'row', alignItems:'center', gap:12 }}>
            <WatchIcon color={colors.primary} size={32} />
            <View style={{ flex:1 }}>
              <Text style={{ color: colors.text, fontSize:16, fontWeight:'700' }}>{d.model || 'Smartwatch'}</Text>
              <Text style={{ color: colors.textSecondary, fontSize:13 }}>IMEI: {d.imei}</Text>
            </View>
            <StatusDot status={d.isActive ? 'active' : 'inactive'} size={8} />
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ c:{flex:1,padding:24}, card:{padding:20,marginBottom:12} });
