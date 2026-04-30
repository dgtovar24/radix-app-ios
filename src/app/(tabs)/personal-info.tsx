import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { patientService } from '../../services/api';
import Card from '../../components/Card';
import Input from '../../components/Input';
import PrimaryButton from '../../components/PrimaryButton';
import { UserIcon } from '../../components/Icons';

export default function PersonalInfoScreen() {
  const colors = useThemeColors();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);

  useEffect(() => { loadInfo(); }, []);

  const loadInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userId = await SecureStore.getItemAsync('user_id');
      if (token && userId) {
        try {
          const patients = await patientService.getAll(token);
          if (patients.length > 0) {
            setFullName(patients[0].fullName || '');
          }
        } catch {}
      }
    } catch {}
  };

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Completa todos los campos de contraseña');
      return;
    }
    setPassSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setShowPasswordSection(false);
    setTimeout(() => setPassSaved(false), 2000);
  };

  const handleChangePhoto = () => {
    Alert.alert('Foto de perfil', 'Aquí se abrirá la galería para cambiar tu foto.');
  };

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'P';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Editar Perfil</Text>

      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={[styles.cameraBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cameraIcon, { color: colors.primary }]}>+</Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.photoHint, { color: colors.textSecondary }]}>
          Toca para cambiar la foto
        </Text>
      </View>

      <Card style={styles.formCard}>
        <Input
          label="NOMBRE COMPLETO"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Tu nombre completo"
        />
        <View style={{ height: 16 }} />
        <Input
          label="EMAIL"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={{ height: 16 }} />
        <Input
          label="TELÉFONO"
          value={phone}
          onChangeText={setPhone}
          placeholder="+34 612 345 678"
          keyboardType="phone-pad"
        />
        <View style={{ height: 16 }} />
        <Input
          label="DIRECCIÓN"
          value={address}
          onChangeText={setAddress}
          placeholder="Calle, número, ciudad"
        />
        <View style={{ height: 24 }} />
        <PrimaryButton
          title={saved ? 'Guardado' : 'Guardar Cambios'}
          onPress={handleSaveProfile}
          disabled={saved}
        />
        {saved && (
          <Text style={[styles.savedHint, { color: colors.success }]}>
            Perfil actualizado correctamente
          </Text>
        )}
      </Card>

      <TouchableOpacity
        onPress={() => setShowPasswordSection(!showPasswordSection)}
        style={[styles.passwordToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
        activeOpacity={0.7}
      >
        <Text style={[styles.passwordToggleText, { color: colors.text }]}>
          Cambiar Contraseña
        </Text>
        <Text style={[styles.passwordToggleArrow, { color: colors.textSecondary }]}>
          {showPasswordSection ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {showPasswordSection && (
        <Card style={styles.passwordCard}>
          <Input
            label="CONTRASEÑA ACTUAL"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <View style={{ height: 16 }} />
          <Input
            label="NUEVA CONTRASEÑA"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <View style={{ height: 24 }} />
          <PrimaryButton
            title={passSaved ? 'Contraseña actualizada' : 'Actualizar Contraseña'}
            onPress={handleChangePassword}
            disabled={passSaved}
          />
          {passSaved && (
            <Text style={[styles.savedHint, { color: colors.success }]}>
              Contraseña actualizada correctamente
            </Text>
          )}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    fontFamily: 'Inter',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  photoHint: {
    fontSize: 13,
    marginTop: 8,
    fontFamily: 'Inter',
  },
  formCard: { padding: 20, marginBottom: 16 },
  savedHint: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  passwordToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  passwordToggleText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  passwordToggleArrow: {
    fontSize: 12,
  },
  passwordCard: { padding: 20, marginBottom: 16 },
});
