'use client';

/**
 * PriceChart Component
 *
 * Price chart using lightweight-charts library.
 * Falls back to a simple visual when library not available.
 */

import { useEffect, useRef, useState } from 'react';
import { ChartData } from '@/contracts/types';

interface PriceChartProps {
  data: ChartData | null;
  isLoading: boolean;
  height?: number;
}

export function PriceChart({ data, isLoading, height = 300 }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<unknown>(null);
  const [chartError, setChartError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !data?.dataPoints.length) return;

    let chart: unknown;
    let series: unknown;

    const initChart = async () => {
      try {
        // Dynamically import lightweight-charts
        const { createChart, ColorType } = await import('lightweight-charts');

        // Clear any existing chart
        if (chartRef.current) {
          (chartRef.current as { remove: () => void }).remove();
        }

        // Create chart
        chart = createChart(containerRef.current!, {
          height,
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#8b949e',
          },
          grid: {
            vertLines: { color: '#21262d' },
            horzLines: { color: '#21262d' },
          },
          crosshair: {
            mode: 1,
          },
          rightPriceScale: {
            borderColor: '#30363d',
          },
          timeScale: {
            borderColor: '#30363d',
            timeVisible: true,
            secondsVisible: false,
          },
        });

        // Add area series
        series = (chart as { addAreaSeries: (options: object) => unknown }).addAreaSeries({
          lineColor: '#58a6ff',
          topColor: 'rgba(88, 166, 255, 0.4)',
          bottomColor: 'rgba(88, 166, 255, 0.0)',
          lineWidth: 2,
        });

        // Transform data for chart
        const chartData = data.dataPoints.map((point) => ({
          time: Math.floor(new Date(point.timestamp).getTime() / 1000) as unknown,
          value: point.price,
        }));

        // Set data
        (series as { setData: (data: unknown[]) => void }).setData(chartData);

        // Fit content
        (chart as { timeScale: () => { fitContent: () => void } }).timeScale().fitContent();

        chartRef.current = chart;

        // Handle resize
        const resizeObserver = new ResizeObserver(() => {
          if (containerRef.current && chart) {
            (chart as { applyOptions: (options: object) => void }).applyOptions({
              width: containerRef.current.clientWidth,
            });
          }
        });

        if (containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }

        return () => {
          resizeObserver.disconnect();
          if (chart) {
            (chart as { remove: () => void }).remove();
          }
        };
      } catch (error) {
        console.warn('Failed to load chart library:', error);
        setChartError(true);
      }
    };

    initChart();

    return () => {
      if (chartRef.current) {
        (chartRef.current as { remove: () => void }).remove();
        chartRef.current = null;
      }
    };
  }, [data, height]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center bg-background-tertiary rounded-lg animate-pulse"
        style={{ height }}
      >
        <div className="text-text-muted">Loading chart...</div>
      </div>
    );
  }

  // No data state
  if (!data || data.dataPoints.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-background-tertiary rounded-lg"
        style={{ height }}
      >
        <div className="text-center text-text-muted">
          <svg
            className="h-12 w-12 mx-auto mb-2 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <p>No chart data available</p>
          <p className="text-sm mt-1">Chart history builds over time from price updates</p>
        </div>
      </div>
    );
  }

  // Fallback simple chart if library fails
  if (chartError) {
    return <SimpleFallbackChart data={data} height={height} />;
  }

  // Main chart container
  return <div ref={containerRef} className="w-full" style={{ height }} />;
}

/**
 * Simple SVG-based fallback chart
 */
function SimpleFallbackChart({
  data,
  height,
}: {
  data: ChartData;
  height: number;
}) {
  const points = data.dataPoints;
  const prices = points.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // Generate SVG path
  const width = 100; // Percentage width
  const pathPoints = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = 100 - ((point.price - minPrice) / priceRange) * 80 - 10; // 10-90% range
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  });

  const pathD = pathPoints.join(' ');

  // Determine color based on trend
  const isPositive = points[points.length - 1].price >= points[0].price;
  const lineColor = isPositive ? '#3fb950' : '#f85149';
  const fillColor = isPositive ? 'rgba(63, 185, 80, 0.1)' : 'rgba(248, 81, 73, 0.1)';

  return (
    <div className="relative bg-background-tertiary rounded-lg" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#21262d" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#21262d" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#21262d" strokeWidth="0.5" />

        {/* Area fill */}
        <path
          d={`${pathD} L 100 100 L 0 100 Z`}
          fill={fillColor}
        />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Price labels */}
      <div className="absolute top-2 right-2 text-xs text-text-muted font-mono">
        {maxPrice.toFixed(6)}
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-text-muted font-mono">
        {minPrice.toFixed(6)}
      </div>
    </div>
  );
}
