import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { patientService } from '../../services/api';
import Card from '../../components/Card';
import {
  ChevronRightIcon,
  UserIcon,
  CopyIcon,
  HeartIcon,
  MessageIcon,
  GlobeIcon,
  ShieldIcon,
  LinkIcon,
  LogoutIcon,
} from '../../components/Icons';

const MOCK_PATIENT = {
  fullName: 'María García López',
  familyAccessCode: 'FAM-ABC12345',
  phone: '+34 612 345 678',
  address: 'Calle Mayor 15, Madrid',
};

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [patient, setPatient] = useState(MOCK_PATIENT);

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userId = await SecureStore.getItemAsync('user_id');
      if (token && userId) {
        try {
          const data = await patientService.getAll(token);
          if (data.length > 0 && data[0].fullName) {
            setPatient({
              ...MOCK_PATIENT,
              fullName: data[0].fullName,
            });
          }
        } catch {}
      }
    } catch {}
  };

  const handleCopyCode = () => {
    Alert.alert('Código Familiar', `Tu código de acceso familiar es: ${patient.familyAccessCode}\n\nCompártelo con tus familiares.`);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_id');
    await SecureStore.deleteItemAsync('user_role');
    router.replace('/login');
  };

  const initials = patient.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {patient.fullName}
        </Text>
        <Text style={[styles.role, { color: colors.textSecondary }]}>
          Paciente en tratamiento
        </Text>
      </View>

      <Card style={styles.familyCard}>
        <View style={styles.familyHeader}>
          <ShieldIcon color={colors.primary} size={22} />
          <View style={styles.familyInfo}>
            <Text style={[styles.familyTitle, { color: colors.text }]}>
              Código de Acceso Familiar
            </Text>
            <Text style={[styles.familyDesc, { color: colors.textSecondary }]}>
              Comparte este código con tus familiares para que puedan ver tu
              estado de salud durante el tratamiento.
            </Text>
          </View>
        </View>
        <View style={[styles.codeRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.codeText, { color: colors.primary }]}>
            {patient.familyAccessCode}
          </Text>
          <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
            <CopyIcon color={colors.primary} size={18} />
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.menuCard}>
        <MenuItem
          icon={<HeartIcon color={colors.primary} size={20} />}
          label="Datos de Salud"
          onPress={() => router.push('/(tabs)/health-data')}
          colors={colors}
        />
        <MenuDivider colors={colors} />
        <MenuItem
          icon={<ShieldIcon color={colors.primary} size={20} />}
          label="Historial de Radiación"
          onPress={() => router.push('/(tabs)/radiation-history')}
          colors={colors}
        />
        <MenuDivider colors={colors} />
        <MenuItem
          icon={<MessageIcon color={colors.primary} size={20} />}
          label="Contactar al Médico"
          onPress={() => router.push('/(tabs)/contact-doctor')}
          colors={colors}
        />
        <MenuDivider colors={colors} />
        <MenuItem
          icon={<UserIcon color={colors.primary} size={20} />}
          label="Datos Personales"
          onPress={() => router.push('/(tabs)/personal-info')}
          colors={colors}
        />
        <MenuDivider colors={colors} />
        <MenuItem
          icon={<GlobeIcon color={colors.primary} size={20} />}
          label="Idioma"
          value="Español"
          onPress={() => router.push('/(tabs)/language')}
          colors={colors}
        />
        <MenuDivider colors={colors} />
        <MenuItem
          icon={<LinkIcon color={colors.primary} size={20} />}
          label="Conexiones"
          value="8 servicios"
          onPress={() => router.push('/(tabs)/connections')}
          colors={colors}
        />
      </Card>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <LogoutIcon color={colors.error} size={20} />
        <Text style={[styles.logoutText, { color: colors.error }]}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MenuItem({
  icon,
  label,
  value,
  onPress,
  colors,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      {icon}
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.menuRight}>
        {value && (
          <Text style={[styles.menuValue, { color: colors.textSecondary }]}>
            {value}
          </Text>
        )}
        <ChevronRightIcon color={colors.textSecondary} size={18} />
      </View>
    </TouchableOpacity>
  );
}

function MenuDivider({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  return <View style={{ height: 1, backgroundColor: colors.border }} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 48 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  role: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Inter',
  },
  familyCard: { padding: 20, marginBottom: 16 },
  familyHeader: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  familyInfo: { flex: 1 },
  familyTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  familyDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'Inter',
  },
  copyButton: { padding: 4 },
  menuCard: { padding: 4, marginBottom: 24 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuValue: {
    fontSize: 14,
    fontFamily: 'Inter',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});
