import { View, StyleSheet } from 'react-native';
import { Svg, Line, Polyline, Text as SvgText, Rect, Circle } from 'react-native-svg';

interface BarChartProps {
  data: { label: string; value: number }[];
  width: number;
  height: number;
  color: string;
  maxValue?: number;
}

export function BarChart({ data, width, height, color, maxValue }: BarChartProps) {
  const padding = { top: 10, bottom: 28, left: 10, right: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const barW = (chartW / data.length) * 0.6;
  const gap = (chartW / data.length) * 0.4;

  return (
    <Svg width={width} height={height}>
      {data.map((d, i) => {
        const barH = (d.value / max) * chartH;
        const x = padding.left + i * (barW + gap) + gap / 2;
        const y = padding.top + chartH - barH;

        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={barH}
            fill={color}
            rx={4}
            opacity={0.85}
          />
        );
      })}
    </Svg>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  width: number;
  height: number;
  color: string;
  maxValue?: number;
  showDots?: boolean;
}

export function LineChart({ data, width, height, color, maxValue, showDots }: LineChartProps) {
  const padding = { top: 10, bottom: 28, left: 10, right: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  const points = data
    .map((d, i) => {
      const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
      const y = padding.top + chartH - (d.value / max) * chartH;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {showDots &&
        data.map((d, i) => {
          const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
          const y = padding.top + chartH - (d.value / max) * chartH;
          return (
            <Circle key={i} cx={x} cy={y} r={4} fill={color} opacity={0.9} />
          );
        })}
    </Svg>
  );
}

interface AreaChartProps {
  data: { label: string; value: number }[];
  width: number;
  height: number;
  color: string;
  maxValue?: number;
}

export function AreaChart({ data, width, height, color, maxValue }: AreaChartProps) {
  const padding = { top: 10, bottom: 28, left: 10, right: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  const areaPoints = data
    .map((d, i) => {
      const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
      const y = padding.top + chartH - (d.value / max) * chartH;
      return `${x},${y}`;
    })
    .join(' ');

  const lastX = padding.left + chartW;
  const bottomY = padding.top + chartH;
  const areaPath = `${areaPoints} ${lastX},${bottomY} ${padding.left},${bottomY}`;

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={areaPoints}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Polyline
        points={areaPath}
        fill={color}
        fillOpacity={0.12}
        stroke="none"
      />
    </Svg>
  );
}
