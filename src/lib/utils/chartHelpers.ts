// Chart data transformation utilities

import { ChartDataPoint } from '@/types/ui';
import { colors } from '@/lib/constants/designSystem';

/**
 * Transform project data for progress chart
 */
export function transformProjectsToChartData(
  projects: Array<{
    id: string;
    title: string;
    status: string;
    _count?: { tasks: number };
    tasks?: Array<{ status: string }>;
  }>
): Array<{ id: string; title: string; progress: number; status: string }> {
  return projects.map((project) => {
    let progress = 0;

    if (project.tasks && project.tasks.length > 0) {
      const completedTasks = project.tasks.filter((task) => task.status === 'DONE').length;
      progress = Math.round((completedTasks / project.tasks.length) * 100);
    }

    return {
      id: project.id,
      title: project.title,
      progress,
      status: project.status,
    };
  });
}

/**
 * Get color for project status
 */
export function getProjectStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return colors.primary[500];
    case 'COMPLETED':
      return colors.success[500];
    case 'ARCHIVED':
      return colors.gray[400];
    default:
      return colors.gray[500];
  }
}

/**
 * Get color for task priority
 */
export function getTaskPriorityColor(priority: string): string {
  switch (priority) {
    case 'LOW':
      return colors.success[500];
    case 'MEDIUM':
      return colors.warning[500];
    case 'HIGH':
      return '#f97316'; // orange-500
    case 'URGENT':
      return colors.error[500];
    default:
      return colors.gray[500];
  }
}

/**
 * Get color for task status
 */
export function getTaskStatusColor(status: string): string {
  switch (status) {
    case 'TODO':
      return colors.gray[400];
    case 'IN_PROGRESS':
      return colors.primary[500];
    case 'REVIEW':
      return colors.warning[500];
    case 'DONE':
      return colors.success[500];
    default:
      return colors.gray[500];
  }
}

/**
 * Transform task distribution by assignee
 */
export function transformTasksByAssignee(
  tasks: Array<{
    assigneeId: string | null;
    assignee?: { name: string | null; email: string } | null;
  }>
): ChartDataPoint[] {
  const assigneeMap = new Map<string, { name: string; count: number }>();

  tasks.forEach((task) => {
    if (task.assigneeId && task.assignee) {
      const name = task.assignee.name || task.assignee.email;
      const existing = assigneeMap.get(task.assigneeId);
      if (existing) {
        existing.count++;
      } else {
        assigneeMap.set(task.assigneeId, { name, count: 1 });
      }
    }
  });

  const chartData: ChartDataPoint[] = Array.from(assigneeMap.values()).map((data, index) => ({
    label: data.name,
    value: data.count,
    color: getChartColor(index),
  }));

  return chartData.sort((a, b) => b.value - a.value);
}

/**
 * Get chart color by index
 */
function getChartColor(index: number): string {
  const chartColors = [
    colors.primary[500],
    colors.success[500],
    colors.warning[500],
    colors.error[500],
    '#8b5cf6', // purple-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
    '#f97316', // orange-500
  ];
  return chartColors[index % chartColors.length];
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Format number with abbreviation (K, M, B)
 */
export function formatNumberAbbreviation(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
