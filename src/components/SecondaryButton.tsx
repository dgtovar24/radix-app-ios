import { Text, TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native';
import { useThemeColors } from '../theme/useThemeColor';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function SecondaryButton({ title, onPress, disabled, style }: SecondaryButtonProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: colors.textSecondary }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
});
