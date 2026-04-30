import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useThemeColors } from '../../theme/useThemeColor';
import Card from '../../components/Card';
import Input from '../../components/Input';
import PrimaryButton from '../../components/PrimaryButton';
import { MessageIcon } from '../../components/Icons';

export default function ContactDoctorScreen() {
  const colors = useThemeColors();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    setSubmitted(true);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!submitted ? (
          <>
            <Text style={[styles.title, { color: colors.text }]}>
              Contactar al Médico
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Envía un mensaje a tu médico. Te responderá lo antes posible.
            </Text>

            <Card style={styles.formCard}>
              <Input
                label="Asunto"
                value={subject}
                onChangeText={setSubject}
                placeholder="Ej. Consulta sobre mi tratamiento"
              />
              <View style={{ height: 16 }} />
              <Input
                label="Mensaje"
                value={message}
                onChangeText={setMessage}
                placeholder="Escribe tu mensaje aquí..."
                multiline
                numberOfLines={5}
                style={{ minHeight: 120, textAlignVertical: 'top' }}
              />
              <View style={{ height: 20 }} />
              <PrimaryButton title="Enviar Mensaje" onPress={handleSend} />
            </Card>
          </>
        ) : (
          <Card style={styles.successCard}>
            <MessageIcon color={colors.success} size={40} />
            <Text style={[styles.successTitle, { color: colors.text }]}>
              Mensaje enviado
            </Text>
            <Text style={[styles.successText, { color: colors.textSecondary }]}>
              Tu médico recibirá tu mensaje y te responderá pronto.
            </Text>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: 'Inter',
  },
  formCard: { padding: 20 },
  successCard: {
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
});
