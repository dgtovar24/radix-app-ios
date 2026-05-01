import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import ThemeProvider, { useTheme } from '../theme/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';
import { registerBackgroundSync } from '../services/backgroundSync';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppNavigator() {
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    registerBackgroundSync();
  }, []);

  useNotifications((data) => {
    if (data?.route) {
      router.push(data.route as any);
    }
  });

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', fontFamily: 'Inter' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="recover" options={{ headerShown: false }} />
      <Stack.Screen name="family-login" options={{ headerShown: false }} />
      <Stack.Screen name="family-dashboard" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
