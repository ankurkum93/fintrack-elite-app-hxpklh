
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// Simple doughnut that shows spent ratio
type Props = {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0..1
  label?: string;
};

const DoughnutChart = ({ size = 120, strokeWidth = 12, progress, label }: Props) => {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const dash = circumference * clamped;
  const dashGap = circumference - dash;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" originX={size / 2} originY={size / 2}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.grey}
            strokeOpacity={0.2}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.accent}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${dashGap}`}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>
      {label ? <Text style={{ marginTop: 8, color: colors.text, fontWeight: '700' }}>{label}</Text> : null}
    </View>
  );
};

export default DoughnutChart;
