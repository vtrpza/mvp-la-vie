'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: React.ReactNode;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  className?: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
    border: 'border-blue-200',
    glow: 'shadow-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    text: 'text-green-600',
    border: 'border-green-200',
    glow: 'shadow-green-100'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
    border: 'border-purple-200',
    glow: 'shadow-purple-100'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-500',
    text: 'text-orange-600',
    border: 'border-orange-200',
    glow: 'shadow-orange-100'
  },
  pink: {
    bg: 'bg-pink-50',
    icon: 'bg-pink-500',
    text: 'text-pink-600',
    border: 'border-pink-200',
    glow: 'shadow-pink-100'
  }
};

export function EnhancedStatCard({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  icon, 
  description, 
  color = 'blue',
  className 
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const colorScheme = colorVariants[color];

  useEffect(() => {
    const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
    const timer = setTimeout(() => {
      setAnimatedValue(numericValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (typeof value === 'string' && value.includes('$')) {
      return `$${val.toLocaleString()}`;
    }
    if (typeof value === 'string' && value.includes('%')) {
      return `${val}%`;
    }
    if (typeof value === 'string' && value.includes('R$')) {
      return `R$ ${val.toLocaleString()}`;
    }
    return val.toLocaleString();
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-300 ease-out",
        "bg-white rounded-xl border border-gray-200 p-6",
        "hover:shadow-lg hover:-translate-y-1",
        colorScheme.glow,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 rounded-xl overflow-hidden">
        <div className={cn("w-full h-full", colorScheme.bg)} />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-3 rounded-lg transition-all duration-300",
            colorScheme.icon,
            isHovered ? "scale-110 shadow-lg" : ""
          )}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
        
        <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {typeof value === 'string' ? value : formatValue(animatedValue)}
        </div>
        
        {change !== undefined && (
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
              changeType === 'increase' 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            )}>
              {changeType === 'increase' ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
            <span className="text-xs text-gray-500">vs último mês</span>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity duration-300",
        "bg-gradient-to-r opacity-0 group-hover:opacity-10",
        colorScheme.icon
      )} />
    </div>
  );
}