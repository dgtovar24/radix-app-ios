import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { useThemeColors } from '../theme/useThemeColor';

interface RadiationGaugeProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
}

function getGaugeColor(value: number, maxValue: number, colors: ReturnType<typeof useThemeColors>): string {
  const ratio = value / maxValue;
  if (ratio > 0.8) return colors.error;
  if (ratio > 0.5) return colors.warning;
  return colors.success;
}

export default function RadiationGauge({
  value,
  maxValue,
  size = 160,
  strokeWidth = 12,
}: RadiationGaugeProps) {
  const colors = useThemeColors();
  const gaugeColor = getGaugeColor(value, maxValue, colors);
  const ratio = Math.min(value / maxValue, 1);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference * ratio} ${circumference * (1 - ratio)}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      <View style={styles.center}>
        <Text style={[styles.value, { color: colors.text }]}>
          {value.toFixed(2)}
        </Text>
        <Text style={[styles.unit, { color: colors.textSecondary }]}>mSv</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  unit: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Inter',
  },
});
