import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '../theme/useThemeColor';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
}

export default function ProgressBar({ progress, color }: ProgressBarProps) {
  const colors = useThemeColors();
  const fillColor = color ?? colors.primary;
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={[styles.track, { backgroundColor: colors.border }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: fillColor,
            width: `${clamped * 100}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
