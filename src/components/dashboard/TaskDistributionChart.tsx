'use client';

import React, { useState } from 'react';
import { ChartDataPoint } from '@/types/ui';

export interface TaskDistributionChartProps {
  data: ChartDataPoint[];
  maxDisplay?: number;
}

const TaskDistributionChart: React.FC<TaskDistributionChartProps> = ({ data, maxDisplay = 5 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayData = data.slice(0, maxDisplay);
  const maxValue = Math.max(...displayData.map((d) => d.value), 1);

  if (displayData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No task distribution data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayData.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 truncate">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-gray-700 ml-2">
                {item.value} {item.value === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color,
                  transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
                }}
              />
            </div>
            {isHovered && (
              <div className="absolute top-full left-0 mt-2 bg-gray-900 text-white text-xs rounded px-2 py-1 z-10">
                {item.value} tasks ({Math.round((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100)}%)
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskDistributionChart;
