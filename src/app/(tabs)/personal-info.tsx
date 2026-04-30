import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { patientService, type Patient } from '../../services/api';

export default function PersonalInfoScreen() {
  const colors = useThemeColors();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const t = await SecureStore.getItemAsync('auth_token');
    if (!t) return;
    const patients = await patientService.getAll(t);
    if (patients.length > 0) {
      const p = patients[0];
      setPatient(p);
      setPhone(p.phone ?? '');
      setAddress(p.address ?? '');
    }
  };

  const save = async () => {
    if (!patient) return;
    setSaving(true);
    const t = await SecureStore.getItemAsync('auth_token');
    if (!t) return;
    await patientService.update(patient.id, { phone, address }, t!);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <View style={[styles.c, { backgroundColor: colors.background }]}>
      <View style={{ padding: 24 }}>
        {patient ? (
          <>
            <Text style={{ color: colors.text, fontSize:20, fontWeight:'700', marginBottom:4 }}>{patient.fullName}</Text>
            <Text style={{ color: colors.textSecondary, fontSize:14, marginBottom:24 }}>Actualiza tu información de contacto</Text>
            <Text style={{ color: colors.textSecondary, fontSize:12, fontWeight:'600', marginBottom:6 }}>TELÉFONO</Text>
            <TextInput style={[styles.inp, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]} value={phone} onChangeText={setPhone} placeholder="+34 600 000 000" placeholderTextColor={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontSize:12, fontWeight:'600', marginBottom:6, marginTop:16 }}>DIRECCIÓN</Text>
            <TextInput style={[styles.inp, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]} value={address} onChangeText={setAddress} placeholder="Calle Mayor 123" placeholderTextColor={colors.textSecondary} />
            <TouchableOpacity onPress={save} disabled={saving} style={[styles.btn, { backgroundColor: colors.primary, marginTop:24 }]}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color:'#fff', fontWeight:'700', fontSize:16 }}>{saved ? 'Guardado' : 'Guardar Cambios'}</Text>}
            </TouchableOpacity>
          </>
        ) : <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ c:{flex:1}, inp:{borderWidth:1,borderRadius:12,padding:14,fontSize:15}, btn:{padding:16,borderRadius:14,alignItems:'center'} });
