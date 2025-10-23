import type { Metadata } from 'next';

// Default metadata configuration
const defaultMetadata: Metadata = {
  title: {
    default: 'Planova - Project Management System',
    template: '%s | Planova',
  },
  description: 'A modern, full-stack project management system built with Next.js',
  keywords: ['project management', 'task tracking', 'team collaboration', 'productivity'],
  authors: [{ name: 'Planova Team' }],
  creator: 'Planova Team',
  publisher: 'Planova',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    title: 'Planova - Project Management System',
    description: 'A modern, full-stack project management system built with Next.js',
    siteName: 'Planova',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planova - Project Management System',
    description: 'A modern, full-stack project management system built with Next.js',
  },
};

// Page-specific metadata generators
export const getDashboardMetadata = (): Metadata => ({
  ...defaultMetadata,
  title: 'Dashboard | Planova',
  description: 'View your project management dashboard with key metrics and recent activity',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Dashboard | Planova',
    description: 'View your project management dashboard with key metrics and recent activity',
  },
});

export const getProjectsMetadata = (): Metadata => ({
  ...defaultMetadata,
  title: 'Projects | Planova',
  description: 'Manage your projects, view project details, and track progress',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Projects | Planova',
    description: 'Manage your projects, view project details, and track progress',
  },
});

export const getTasksMetadata = (): Metadata => ({
  ...defaultMetadata,
  title: 'Tasks | Planova',
  description: 'Track and manage your tasks across all projects',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Tasks | Planova',
    description: 'Track and manage your tasks across all projects',
  },
});

export const getTeamMetadata = (): Metadata => ({
  ...defaultMetadata,
  title: 'Team | Planova',
  description: 'Manage team members and collaboration settings',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Team | Planova',
    description: 'Manage team members and collaboration settings',
  },
});

export const getReportsMetadata = (): Metadata => ({
  ...defaultMetadata,
  title: 'Reports | Planova',
  description: 'View analytics and reports on project and task performance',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Reports | Planova',
    description: 'View analytics and reports on project and task performance',
  },
});

export default defaultMetadata;