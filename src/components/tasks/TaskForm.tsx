'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateFutureDate,
  validateFields,
  hasErrors,
  ValidationResult,
} from '@/lib/utils/validationHelpers';

export interface TaskFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string;
    projectId: string;
    assigneeId: string;
  };
  onSubmit?: (data: any) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'MEDIUM',
    status: initialData?.status || 'TODO',
    dueDate: initialData?.dueDate || '',
    projectId: initialData?.projectId || '',
    assigneeId: initialData?.assigneeId || '',
  });

  // Fetch projects and users for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [projectsRes, usersRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/users'),
        ]);
        const projectsData = await projectsRes.json();
        const usersData = await usersRes.json();
        setProjects(projectsData.data || projectsData || []);
        setUsers(usersData.data || usersData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load form data', 'error');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [showToast]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    let result: ValidationResult | undefined;
    
    switch (field) {
      case 'title':
        result = validateRequired(formData.title, 'Title');
        if (result.isValid) {
          result = validateMinLength(formData.title, 3, 'Title');
        }
        if (result.isValid) {
          result = validateMaxLength(formData.title, 100, 'Title');
        }
        break;
      case 'description':
        result = validateMaxLength(formData.description, 500, 'Description');
        break;
      case 'projectId':
        result = validateRequired(formData.projectId, 'Project');
        break;
      case 'dueDate':
        if (formData.dueDate) {
          result = validateFutureDate(formData.dueDate, 'Due date');
        }
        break;
      default:
        return;
    }

    if (result) {
      if (!result.isValid && result.error) {
        setErrors((prev) => ({ ...prev, [field]: result!.error! }));
      } else if (result.isValid) {
        // Clear error if validation passes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const validators = {
      title: (value: string) => 
        validateRequired(value, 'Title') ||
        validateMinLength(value, 3, 'Title') ||
        validateMaxLength(value, 100, 'Title'),
      description: (value: string) => validateMaxLength(value, 500, 'Description'),
      projectId: (value: string) => validateRequired(value, 'Project'),
    };

    const newErrors = validateFields(formData, validators);
    
    // Validate due date if provided
    if (formData.dueDate) {
      const dueDateResult = validateFutureDate(formData.dueDate, 'Due date');
      if (!dueDateResult.isValid && dueDateResult.error) {
        newErrors.dueDate = dueDateResult.error;
      }
    }

    setErrors(newErrors);
    return !hasErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      projectId: true,
      priority: true,
      status: true,
      dueDate: true,
      assigneeId: true,
    });

    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API call
        const url = initialData?.id ? `/api/tasks/${initialData.id}` : '/api/tasks';
        const method = initialData?.id ? 'PATCH' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            assigneeId: formData.assigneeId || null,
            dueDate: formData.dueDate || null,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save task');
        }

        showToast(
          initialData?.id ? 'Task updated successfully' : 'Task created successfully',
          'success'
        );
        router.push('/tasks');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      showToast('Failed to save task. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Task Title"
        type="text"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        error={touched.title ? errors.title : undefined}
        placeholder="Enter task title"
        required
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Enter task description"
          rows={4}
          className={`w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-white ${
            touched.description && errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
          }`}
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Project */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.projectId}
          onChange={(e) => handleChange('projectId', e.target.value)}
          onBlur={() => handleBlur('projectId')}
          className={`w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-white ${
            touched.projectId && errors.projectId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
          }`}
          required
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
        {touched.projectId && errors.projectId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.projectId}</p>
        )}
      </div>

      {/* Priority and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      {/* Assignee and Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assignee
          </label>
          <select
            value={formData.assigneeId}
            onChange={(e) => handleChange('assigneeId', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          onBlur={() => handleBlur('dueDate')}
          error={touched.dueDate ? errors.dueDate : undefined}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex-1"
        >
          {initialData?.id ? 'Update Task' : 'Create Task'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
