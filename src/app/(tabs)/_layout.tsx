import { Tabs } from 'expo-router';
import { useThemeColors } from '../../theme/useThemeColor';
import {
  HomeIcon,
  WatchIcon,
  SettingsIcon,
  BarChartIcon,
  PillIcon,
  BellIcon,
} from '../../components/Icons';

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', fontFamily: 'Inter' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
          fontFamily: 'Inter',
        },
        tabBarItemStyle: {
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerShown: false,
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name="watch"
        options={{
          title: 'Reloj',
          tabBarIcon: ({ color }) => <WatchIcon color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name="health-history"
        options={{
          title: 'Salud',
          tabBarIcon: ({ color }) => <BarChartIcon color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name="treatment"
        options={{
          title: 'Tratamiento',
          tabBarIcon: ({ color }) => <PillIcon color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color }) => <BellIcon color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} size={18} />,
        }}
      />
      <Tabs.Screen name="health-data" options={{ title: 'Datos de Salud', href: null }} />
      <Tabs.Screen name="contact-doctor" options={{ title: 'Contactar Médico', href: null }} />
      <Tabs.Screen name="radiation-history" options={{ title: 'Historial de Radiación', href: null }} />
      <Tabs.Screen name="language" options={{ title: 'Idioma', href: null }} />
      <Tabs.Screen name="personal-info" options={{ title: 'Datos Personales', href: null }} />
      <Tabs.Screen name="connections" options={{ title: 'Conexiones', href: null }} />
    </Tabs>
  );
}
