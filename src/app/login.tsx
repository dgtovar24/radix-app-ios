import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../theme/useThemeColor';
import { authService } from '../services/api';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { EyeIcon, EyeOffIcon } from '../components/Icons';

const REMEMBER_EMAIL_KEY = 'radix-remember-email';

export default function LoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    loadRememberedEmail();
  }, []);

  const loadRememberedEmail = async () => {
    try {
      const saved = await SecureStore.getItemAsync(REMEMBER_EMAIL_KEY);
      if (saved) {
        setEmail(saved);
        setRemember(true);
      }
    } catch {}
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email.trim(), password);
      await SecureStore.setItemAsync('auth_token', String(response.token));
      await SecureStore.setItemAsync('user_id', String(response.userId));
      await SecureStore.setItemAsync('user_role', String(response.role ?? 'patient'));

      if (remember) {
        await SecureStore.setItemAsync(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        await SecureStore.deleteItemAsync(REMEMBER_EMAIL_KEY);
      }

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', (error as Error).message ?? 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>RADIX</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Panel Médico Inteligente
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Input
              label="CÓDIGO DE SEGURIDAD"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              rightElement={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  {showPassword ? (
                    <EyeOffIcon color={colors.textSecondary} size={20} />
                  ) : (
                    <EyeIcon color={colors.textSecondary} size={20} />
                  )}
                </TouchableOpacity>
              }
            />
          </View>

          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRemember(!remember)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: remember ? colors.primary : colors.border,
                  backgroundColor: remember ? colors.primary : 'transparent',
                },
              ]}
            >
              {remember && <Text style={styles.check}>✓</Text>}
            </View>
            <Text style={[styles.rememberText, { color: colors.textSecondary }]}>
              Recordarme
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title={loading ? '' : 'Iniciar Sesión'}
            onPress={handleLogin}
            disabled={loading}
            style={styles.loginButton}
          />
          {loading && (
            <ActivityIndicator
              color="#FFFFFF"
              style={styles.loadingOverlay}
            />
          )}

          <TouchableOpacity
            onPress={() => router.push('/recover')}
            style={styles.forgotLink}
          >
            <Text style={[styles.forgotText, { color: colors.primary }]}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <SecondaryButton
            title="Acceso para Familiares"
            onPress={() => router.push('/family-login')}
          />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Conexión Encriptada
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 6,
    fontFamily: 'Inter',
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: 'Inter',
  },
  form: { marginBottom: 32 },
  fieldGroup: { marginBottom: 16 },
  eyeButton: { padding: 4 },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  rememberText: {
    fontSize: 14,
    fontFamily: 'Inter',
  },
  loginButton: { marginBottom: 0 },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  forgotLink: { alignItems: 'center', marginTop: 20 },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  footer: { alignItems: 'center', gap: 16, marginTop: 16 },
  footerText: {
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: 'Inter',
  },
});
