import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '../theme/useThemeColor';

type DotStatus = 'active' | 'inactive' | 'warning' | 'error';

interface StatusDotProps {
  status: DotStatus;
  size?: number;
}

const statusColor = {
  active: '#10b981',
  inactive: '#9ca3af',
  warning: '#f59e0b',
  error: '#ef4444',
};

export default function StatusDot({ status, size = 8 }: StatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: statusColor[status],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {},
});
