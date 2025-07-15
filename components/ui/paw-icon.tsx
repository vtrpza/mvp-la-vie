"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface PawIconProps {
  size?: number;
  className?: string;
  color?: string;
  variant?: 'filled' | 'outline' | 'gradient';
}

export const PawIcon: React.FC<PawIconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  variant = 'filled'
}) => {
  const renderPawPrint = () => {
    switch (variant) {
      case 'outline':
        return (
          <>
            {/* Main pad */}
            <ellipse
              cx="12"
              cy="16"
              rx="4"
              ry="3"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Top left toe */}
            <ellipse
              cx="7"
              cy="9"
              rx="1.5"
              ry="2"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Top center toe */}
            <ellipse
              cx="12"
              cy="7"
              rx="1.5"
              ry="2"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Top right toe */}
            <ellipse
              cx="17"
              cy="9"
              rx="1.5"
              ry="2"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bottom toe */}
            <ellipse
              cx="12"
              cy="21"
              rx="1.2"
              ry="1.5"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      
      case 'gradient':
        return (
          <>
            <defs>
              <linearGradient id="pawGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Main pad */}
            <ellipse
              cx="12"
              cy="16"
              rx="4"
              ry="3"
              fill="url(#pawGradient)"
            />
            {/* Top left toe */}
            <ellipse
              cx="7"
              cy="9"
              rx="1.5"
              ry="2"
              fill="url(#pawGradient)"
            />
            {/* Top center toe */}
            <ellipse
              cx="12"
              cy="7"
              rx="1.5"
              ry="2"
              fill="url(#pawGradient)"
            />
            {/* Top right toe */}
            <ellipse
              cx="17"
              cy="9"
              rx="1.5"
              ry="2"
              fill="url(#pawGradient)"
            />
            {/* Bottom toe */}
            <ellipse
              cx="12"
              cy="21"
              rx="1.2"
              ry="1.5"
              fill="url(#pawGradient)"
            />
          </>
        );
      
      default: // filled
        return (
          <>
            {/* Main pad */}
            <ellipse
              cx="12"
              cy="16"
              rx="4"
              ry="3"
              fill={color}
            />
            {/* Top left toe */}
            <ellipse
              cx="7"
              cy="9"
              rx="1.5"
              ry="2"
              fill={color}
            />
            {/* Top center toe */}
            <ellipse
              cx="12"
              cy="7"
              rx="1.5"
              ry="2"
              fill={color}
            />
            {/* Top right toe */}
            <ellipse
              cx="17"
              cy="9"
              rx="1.5"
              ry="2"
              fill={color}
            />
            {/* Bottom toe */}
            <ellipse
              cx="12"
              cy="21"
              rx="1.2"
              ry="1.5"
              fill={color}
            />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("inline-block", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderPawPrint()}
    </svg>
  );
};