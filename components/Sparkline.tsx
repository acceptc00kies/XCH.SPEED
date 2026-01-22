'use client';

/**
 * Sparkline Component
 *
 * Simple SVG sparkline for displaying price trends.
 * Lightweight, no external dependencies.
 */

interface SparklineProps {
  /** Array of price values to display */
  data: number[];
  /** Width of the SVG in pixels */
  width?: number;
  /** Height of the SVG in pixels */
  height?: number;
  /** Color override - auto-determines based on trend if not specified */
  color?: 'green' | 'red' | 'neutral';
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  color,
}: SparklineProps) {
  // Handle empty or single point data
  if (!data || data.length < 2) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="text-text-muted"
      >
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="4 2"
        />
      </svg>
    );
  }

  // Determine color based on trend (first vs last value)
  const trendColor = color ?? (data[data.length - 1] >= data[0] ? 'green' : 'red');

  const colorClasses = {
    green: 'text-accent-green',
    red: 'text-accent-red',
    neutral: 'text-text-muted',
  };

  // Calculate min/max for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1; // Avoid division by zero

  // Padding to prevent clipping at edges
  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Generate path points
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={colorClasses[trendColor]}
      aria-label="Price trend sparkline"
    >
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
