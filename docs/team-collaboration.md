# Team Collaboration Features

## Overview
Planova includes team collaboration features that allow users to work together on projects. This documentation explains how to use these features.

## Features Implemented

### 1. Project Members Management
- Add users to projects as members
- Remove users from projects
- View current project members

### 2. Real-time Notifications
- Receive real-time updates when:
  - Tasks are created, updated, or deleted
  - Projects are created, updated, or deleted
  - Project members are added or removed
  - Comments are added or updated

## API Endpoints

### Project Members
- `POST /api/projects/members` - Add a member to a project
- `DELETE /api/projects/members?projectId={id}&userId={id}` - Remove a member from a project

### Request/Response Examples

#### Add Member to Project
```bash
POST /api/projects/members
Content-Type: application/json

{
  "projectId": "project-id-123",
  "userId": "user-id-456"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "project-id-123",
    "title": "Project Name",
    "members": [
      {
        "id": "user-id-456",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
  }
}
```

#### Remove Member from Project
```bash
DELETE /api/projects/members?projectId=project-id-123&userId=user-id-456
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "project-id-123",
    "title": "Project Name",
    "members": []
  }
}
```

## Real-time Notifications

The application uses Socket.io for real-time communication. When connected, clients will receive notifications for various events.

### Events
- `taskUpdated` - When a task is created, updated, or deleted
- `projectUpdated` - When a project is created, updated, or deleted
- `commentAdded` - When a comment is created, updated, or deleted
- `notification` - General notifications

### Client Implementation
```javascript
import { notificationService } from '@/lib/notificationService';

// Connect to the notification service
notificationService.connect();

// Listen for task updates
notificationService.on('taskUpdated', (data) => {
  console.log('Task updated:', data);
  // Update UI accordingly
});

// Listen for project updates
notificationService.on('projectUpdated', (data) => {
  console.log('Project updated:', data);
  // Update UI accordingly
});
```

## Running with Real-time Features

To use the real-time features, you need to run the custom server that includes Socket.io:

```bash
npm run dev-socket
```

This starts the application on port 3001 with Socket.io support. The frontend will automatically connect to this server for real-time notifications.

Note: For development, the frontend runs on port 3000 and connects to the Socket.io server on port 3001.