import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import Card from '../../components/Card';
import StatusDot from '../../components/StatusDot';
import { LinkIcon, WatchIcon, ActivityIcon, ZapIcon } from '../../components/Icons';

interface PlatformConnection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  connected: boolean;
  localOnly: boolean;
}

const PLATFORMS: Omit<PlatformConnection, 'connected'>[] = [
  {
    id: 'apple-health',
    name: 'Apple Health',
    description: 'Ritmo cardíaco, pasos, distancia, sueño, oxígeno',
    icon: <ActivityIcon color="#FF2D55" size={24} />,
    color: '#FF2D55',
    localOnly: true,
  },
  {
    id: 'strava',
    name: 'Strava',
    description: 'Actividades deportivas, rutas, ritmo, calorías',
    icon: <ZapIcon color="#FC4C02" size={24} />,
    color: '#FC4C02',
    localOnly: false,
  },
  {
    id: 'huawei-health',
    name: 'Huawei Health',
    description: 'Pasos, frecuencia cardíaca, sueño, peso',
    icon: <WatchIcon color="#CF0A2C" size={24} />,
    color: '#CF0A2C',
    localOnly: false,
  },
  {
    id: 'samsung-health',
    name: 'Samsung Health',
    description: 'Actividad, alimentación, sueño, estrés',
    icon: <ActivityIcon color="#1428A0" size={24} />,
    color: '#1428A0',
    localOnly: false,
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    description: 'Actividad diaria, minutos activos, ritmo cardíaco',
    icon: <ActivityIcon color="#4285F4" size={24} />,
    color: '#4285F4',
    localOnly: false,
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    description: 'Pasos, sueño, frecuencia cardíaca, zona activa',
    icon: <ZapIcon color="#00B0B9" size={24} />,
    color: '#00B0B9',
    localOnly: false,
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    description: 'Actividades, métricas avanzadas, análisis corporal',
    icon: <ActivityIcon color="#000000" size={24} />,
    color: '#000000',
    localOnly: false,
  },
  {
    id: 'withings',
    name: 'Withings',
    description: 'Peso, composición corporal, presión arterial, sueño',
    icon: <WatchIcon color="#4A90D9" size={24} />,
    color: '#4A90D9',
    localOnly: false,
  },
];

const CONNECTIONS_KEY = 'radix-connections';

export default function ConnectionsScreen() {
  const colors = useThemeColors();
  const [connections, setConnections] = useState<Record<string, boolean>>({});

  useEffect(() => { loadConnections(); }, []);

  const loadConnections = async () => {
    try {
      const saved = await SecureStore.getItemAsync(CONNECTIONS_KEY);
      if (saved) setConnections(JSON.parse(saved));
    } catch {}
  };

  const toggleConnection = async (id: string, current: boolean) => {
    if (!current) {
      Alert.alert(
        'Conectar servicio',
        `Esto permitirá que Radix lea tus datos de ${PLATFORMS.find((p) => p.id === id)?.name}.`,
        [{ text: 'Cancelar', style: 'cancel' }, { text: 'Conectar', onPress: () => setConnected(id, true) }]
      );
    } else {
      Alert.alert(
        'Desconectar servicio',
        `¿Dejar de sincronizar datos de ${PLATFORMS.find((p) => p.id === id)?.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Desconectar', style: 'destructive', onPress: () => setConnected(id, false) },
        ]
      );
    }
  };

  const setConnected = async (id: string, value: boolean) => {
    const next = { ...connections, [id]: value };
    setConnections(next);
    try { await SecureStore.setItemAsync(CONNECTIONS_KEY, JSON.stringify(next)); } catch {}
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Conexiones</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Conecta tus plataformas de salud para sincronizar tus datos con Radix
      </Text>

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        DISPOSITIVO LOCAL
      </Text>

      {PLATFORMS.filter((p) => p.localOnly).map((platform) => {
        const connected = connections[platform.id] ?? false;
        return (
          <ConnectionCard
            key={platform.id}
            platform={{ ...platform, connected }}
            onToggle={() => toggleConnection(platform.id, connected)}
            colors={colors}
          />
        );
      })}

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        SERVICIOS EXTERNOS
      </Text>

      {PLATFORMS.filter((p) => !p.localOnly).map((platform) => {
        const connected = connections[platform.id] ?? false;
        return (
          <ConnectionCard
            key={platform.id}
            platform={{ ...platform, connected }}
            onToggle={() => toggleConnection(platform.id, connected)}
            colors={colors}
          />
        );
      })}

      <Card style={styles.noteCard}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <LinkIcon color={colors.textSecondary} size={18} />
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>
            Las conexiones con servicios externos requieren autorización en sus
            plataformas. Tus datos se sincronizarán automáticamente tras la
            vinculación.
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

function ConnectionCard({
  platform,
  onToggle,
  colors,
}: {
  platform: PlatformConnection;
  onToggle: () => void;
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <Card style={styles.connectionCard}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.connectionRow}>
        <View style={[styles.platformIcon, { backgroundColor: platform.color + '15' }]}>
          {platform.icon}
        </View>
        <View style={styles.platformInfo}>
          <View style={styles.platformHeader}>
            <Text style={[styles.platformName, { color: colors.text }]}>
              {platform.name}
            </Text>
            <StatusDot status={platform.connected ? 'active' : 'inactive'} size={7} />
          </View>
          <Text style={[styles.platformDesc, { color: colors.textSecondary }]}>
            {platform.description}
          </Text>
        </View>
        <Switch
          value={platform.connected}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary + '60' }}
          thumbColor={platform.connected ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, fontFamily: 'Inter' },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 28, fontFamily: 'Inter' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  connectionCard: { padding: 4, marginBottom: 10 },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 14,
  },
  platformIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformInfo: { flex: 1, gap: 2 },
  platformHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  platformName: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter' },
  platformDesc: { fontSize: 12, lineHeight: 16, fontFamily: 'Inter' },
  noteCard: { padding: 16, marginTop: 16 },
  noteText: { fontSize: 13, lineHeight: 18, flex: 1, fontFamily: 'Inter' },
});
