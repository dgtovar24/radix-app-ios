import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ONBOARDING_KEY } from '../theme/types';
import { useThemeColors } from '../theme/useThemeColor';

export default function Index() {
  const router = useRouter();
  const colors = useThemeColors();

  useEffect(() => {
    checkFirstRoute();
  }, []);

  const checkFirstRoute = async () => {
    try {
      const onboardingDone = await SecureStore.getItemAsync(ONBOARDING_KEY);
      if (!onboardingDone) {
        router.replace('/onboarding');
        return;
      }

      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    } catch {
      router.replace('/login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.title, { color: colors.primary }]}>Radix</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Panel Médico Inteligente
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 4,
    fontFamily: 'Inter',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    letterSpacing: 2,
    fontFamily: 'Inter',
  },
});
