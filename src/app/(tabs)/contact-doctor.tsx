import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { patientService, messageService } from '../../services/api';
import { MessageIcon } from '../../components/Icons';

export default function ContactDoctorScreen() {
  const colors = useThemeColors();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const t = await SecureStore.getItemAsync('auth_token');
      if (!t) return;
      const patients = await patientService.getAll(t);
      const p = patients[0];
      if (p) await messageService.send({ fkPatientId: p.id, messageText: text.trim() }, t);
      setSent(true);
      setText('');
    } catch {} finally { setSending(false); }
  };

  return (
    <KeyboardAvoidingView style={[styles.c, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <View style={{ alignItems:'center', marginBottom:24 }}>
          <MessageIcon color={colors.primary} size={48} />
          <Text style={{ color: colors.text, fontSize:18, fontWeight:'700', marginTop:12 }}>Contactar al Médico</Text>
          <Text style={{ color: colors.textSecondary, fontSize:14, marginTop:4 }}>Envía un mensaje a tu equipo médico</Text>
        </View>
        <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]} placeholder="Escribe tu mensaje aquí..." placeholderTextColor={colors.textSecondary} multiline numberOfLines={6} textAlignVertical="top" value={text} onChangeText={setText} />
        <TouchableOpacity onPress={handleSend} disabled={sending || !text.trim()} style={[styles.btn, { backgroundColor: (sending || !text.trim()) ? colors.textSecondary : colors.primary }]}>
          {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnt}>{sent ? 'Mensaje Enviado' : 'Enviar Mensaje'}</Text>}
        </TouchableOpacity>
        {sent && <Text style={{ color: colors.success, textAlign:'center', marginTop:12, fontWeight:'600' }}>Tu mensaje ha sido enviado al equipo médico</Text>}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ c:{flex:1}, inner:{flex:1,padding:24,justifyContent:'center'}, input:{borderWidth:1,borderRadius:14,padding:16,fontSize:15,minHeight:140,marginBottom:16}, btn:{padding:16,borderRadius:14,alignItems:'center'}, btnt:{color:'#fff',fontSize:16,fontWeight:'700'} });
