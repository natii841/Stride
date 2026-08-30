import React from 'react';

interface ProgressRingProps {
  percentage: number; // 0 to 100+
  size?: number;
  strokeWidth?: number;
  color?: string;
  gradientColors?: [string, string];
  trackColor?: string;
  children?: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 54,
  strokeWidth = 4.5,
  color = '#E1306C',
  gradientColors,
  trackColor,
  children,
  className = '',
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  const gradientId = React.useId().replace(/:/g, '');

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 origin-center"
        viewBox={`0 0 ${size} ${size}`}
      >
        {gradientColors && (
          <defs>
            <linearGradient id={`grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>
        )}

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor || 'currentColor'}
          strokeWidth={strokeWidth}
          fill="none"
          className="text-neutral-200 dark:text-[#262626] transition-colors"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={gradientColors ? `url(#grad-${gradientId})` : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center Label / Icon */}
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
};
