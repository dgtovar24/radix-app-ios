import type { ReactNode } from 'react';
import { TextInput, StyleSheet, View, Text, type TextInputProps, type ViewStyle } from 'react-native';
import { useThemeColors } from '../theme/useThemeColor';

interface InputProps extends TextInputProps {
  label?: string;
  rightElement?: ReactNode;
  wrapperStyle?: ViewStyle;
}

export default function Input({ label, rightElement, wrapperStyle, style, ...props }: InputProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {label ? (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      ) : null}
      <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            { color: colors.text },
            rightElement ? styles.inputWithSuffix : null,
            style,
          ]}
          {...props}
        />
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  inputWithSuffix: {
    paddingRight: 4,
  },
});
