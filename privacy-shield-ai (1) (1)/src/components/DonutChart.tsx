import React, { useState } from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DonutChartProps {
  segments: DonutSegment[];
  totalLabel?: string;
  totalValue?: number | string;
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  totalLabel = 'Total',
  totalValue,
  size = 200,
  strokeWidth = 28,
  showLegend = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const displayTotal = totalValue !== undefined ? totalValue : total;

  const center = size / 2;
  const radius = center - strokeWidth / 2 - 4;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {/* SVG Donut */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {total === 0 ? (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
            />
          ) : (
            segments.map((seg, idx) => {
              if (seg.value === 0) return null;
              const percent = seg.value / total;
              const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
              const strokeDashoffset = -circumference * accumulatedPercent;
              accumulatedPercent += percent;

              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {hoveredIndex !== null ? segments[hoveredIndex].value : displayTotal}
          </span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {hoveredIndex !== null ? segments[hoveredIndex].label : totalLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 min-w-[140px]">
          {segments.map((seg, idx) => {
            const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between text-xs py-1 px-2 rounded-md transition-colors cursor-pointer ${
                  isHovered ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50 text-slate-600'
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span>{seg.label}</span>
                </div>
                <span className="font-semibold text-slate-700 ml-3">
                  {seg.percentage !== undefined ? `${seg.percentage}%` : seg.value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
