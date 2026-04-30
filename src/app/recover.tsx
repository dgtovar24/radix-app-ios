import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../theme/useThemeColor';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';

export default function RecoverScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRecover = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    setSubmitted(true);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        {!submitted ? (
          <>
            <Text style={[styles.title, { color: colors.text }]}>
              Recuperar Contraseña
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Ingresa tu email y te enviaremos instrucciones para restaurar tu
              acceso.
            </Text>

            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
              <PrimaryButton
                title="Restaurar Acceso"
                onPress={handleRecover}
              />
            </View>
          </>
        ) : (
          <View style={styles.successCard}>
            <Text style={[styles.successTitle, { color: colors.text }]}>
              Revisa tu email
            </Text>
            <Text style={[styles.successText, { color: colors.textSecondary }]}>
              Si el email existe en nuestro sistema, recibirás instrucciones
              para restaurar tu contraseña.
            </Text>
          </View>
        )}

        <Text
          style={[styles.backLink, { color: colors.primary }]}
          onPress={() => router.back()}
        >
          Volver al inicio de sesión
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 32,
    fontFamily: 'Inter',
  },
  form: { gap: 24 },
  successCard: { marginBottom: 32 },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  successText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  backLink: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
});
