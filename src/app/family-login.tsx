import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../theme/useThemeColor';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function FamilyLoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [code, setCode] = useState('');

  const handleAccess = () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Ingresa el código de seguimiento');
      return;
    }
    router.push({
      pathname: '/family-dashboard',
      params: { code: code.trim() },
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[styles.logo, { color: colors.primary }]}>RADIX</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Acceso Familiar
        </Text>

        <Card style={styles.formCard}>
          <Text style={[styles.info, { color: colors.textSecondary }]}>
            Ingresa el código de seguimiento que te compartió el paciente para
            ver su estado de salud.
          </Text>

          <Input
            label="CÓDIGO DE SEGUIMIENTO"
            value={code}
            onChangeText={setCode}
            placeholder="Ej. FAM-ABC12345"
            autoCapitalize="characters"
            autoCorrect={false}
            style={{ fontFamily: 'monospace' }}
          />

          <View style={{ height: 24 }} />
          <PrimaryButton title="Ver Estado del Paciente" onPress={handleAccess} />
        </Card>

        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={[styles.backLink, { color: colors.primary }]}>
            Volver al inicio de sesión
          </Text>
        </TouchableOpacity>

        <Badge label="Demostración" variant="warning" />
        <Text style={[styles.demoText, { color: colors.textSecondary }]}>
          Cualquier código te mostrará datos de demostración.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 6,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 32,
    fontFamily: 'Inter',
  },
  formCard: {
    padding: 24,
    width: '100%',
    marginBottom: 24,
  },
  info: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  backLink: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
    fontFamily: 'Inter',
  },
  demoText: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: 'Inter',
  },
});
