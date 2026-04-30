import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../theme/useThemeColor';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantColorKey: Record<BadgeVariant, string> = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const variantBgKey: Record<BadgeVariant, string> = {
  primary: '#dbeafe',
  success: '#d1fae5',
  warning: '#fef3c7',
  error: '#fee2e2',
};

export default function Badge({ label, variant = 'primary' }: BadgeProps) {
  const colors = useThemeColors();

  const bgColor =
    variant === 'primary'
      ? colors.primary + '20'
      : variantBgKey[variant];
  const txtColor =
    variant === 'primary' ? colors.primary : variantColorKey[variant];

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: txtColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});
