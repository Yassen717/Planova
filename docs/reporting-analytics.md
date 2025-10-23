# Reporting and Analytics System

## Overview
The reporting and analytics system provides insights into project and task performance, user activity, and overall system usage. This dashboard helps team leads and managers make data-driven decisions.

## Features Implemented

### 1. Dashboard Overview
- Project statistics (total, active, completed)
- Task statistics (total, by status, by priority)
- User statistics (total users, project owners, task assignees)

### 2. Data Visualization
- Task completion trend chart
- Project progress bars
- Recent activity feed

### 3. API Endpoints
- GET /api/reports - Overview data
- GET /api/reports?type=projects - Project statistics
- GET /api/reports?type=tasks - Task statistics
- GET /api/reports?type=users - User statistics
- GET /api/reports?type=progress - Project progress data
- GET /api/reports?type=activity - Recent activity
- GET /api/reports?type=trend&days=30 - Task completion trend

### 4. Time Range Filtering
- 7-day view
- 30-day view
- 90-day view

## Technical Implementation

### Reporting Service
The reporting service (`reportingService.ts`) provides methods to gather analytics data:

```typescript
// Project statistics
getProjectStats()

// Task statistics
getTaskStats()

// User statistics
getUserStats()

// Project progress data
getProjectProgressData()

// Recent activity
getRecentActivity(limit: number)

// Task completion trend
getTaskCompletionTrend(days: number)
```

### Data Models

#### Project Stats
```typescript
{
  total: number,
  active: number,
  completed: number
}
```

#### Task Stats
```typescript
{
  total: number,
  byStatus: [{ status: string, _count: { status: number } }],
  byPriority: [{ priority: string, _count: { priority: number } }]
}
```

#### User Stats
```typescript
{
  total: number,
  projectOwners: number,
  taskAssignees: number
}
```

## UI Components

### Reporting Dashboard Page
Located at `/reports`, this page displays all analytics data in an organized layout:

1. **Stats Overview Section**
   - Project summary cards
   - Task distribution by status
   - User engagement metrics

2. **Data Visualization Section**
   - Task completion trend bar chart
   - Project progress indicators

3. **Activity Feed**
   - Recent project and task activity
   - Timestamped events

### Interactive Features
- Time range selector (7/30/90 days)
- Manual refresh button
- Responsive design for all screen sizes

## Data Sources

### Project Data
- Total projects count
- Active vs completed projects
- Project creation dates

### Task Data
- Total tasks count
- Task status distribution (TODO, IN_PROGRESS, REVIEW, DONE)
- Task priority distribution (LOW, MEDIUM, HIGH, URGENT)
- Task completion dates

### User Data
- Total user count
- Users with project ownership
- Users with task assignments

### Activity Data
- Recent project creations
- Recent task updates
- Timestamped events

## Future Enhancements

### Additional Reports
- Team performance metrics
- Individual user productivity
- Project timeline analysis
- Resource allocation reports

### Advanced Visualizations
- Pie charts for status/priority distribution
- Line charts for trend analysis
- Heatmaps for activity patterns
- Export functionality (PDF, CSV)

### Custom Reporting
- Report builder interface
- Custom date ranges
- Saved report templates
- Scheduled report generation

## Integration Points

### Services
- Project service for project data
- Task service for task data
- User service for user data

### Database
- Prisma ORM for data aggregation
- GroupBy queries for statistics
- Date filtering for time-based reports

### Frontend
- Real-time data updates
- Interactive charts
- Responsive layout