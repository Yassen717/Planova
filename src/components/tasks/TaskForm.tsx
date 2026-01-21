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
    startDate: string;
    dueDate: string;
    projectId: string;
    assigneeId: string;
  };
  initialProjectId?: string;
  onSubmit?: (data: any) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, initialProjectId, onSubmit }) => {
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
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate || '',
    projectId: initialData?.projectId || initialProjectId || '',
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
        
        const dataToSend = {
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          dueDate: formData.dueDate || null,
          projectId: formData.projectId,
          assigneeId: formData.assigneeId || null,
          priority: formData.priority,
          status: formData.status,
        };
        
        console.log('Sending task data:', dataToSend); // Debug log
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('API Error:', response.status, errorData);
          throw new Error(errorData?.error || 'Failed to save task');
        }

        showToast(
          initialData?.id ? 'Task updated successfully' : 'Task created successfully',
          'success'
        );
        router.push('/tasks');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save task. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-12 bg-slate-200 rounded-xl mb-4"></div>
          <div className="h-32 bg-slate-200 rounded-xl mb-4"></div>
          <div className="h-12 bg-slate-200 rounded-xl mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-slate-200 rounded-xl"></div>
            <div className="h-12 bg-slate-200 rounded-xl"></div>
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
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Enter task description"
          rows={4}
          className={`block w-full px-4 py-3 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 resize-none ${
            touched.description && errors.description
              ? 'border-red-300 focus:border-red-500'
              : 'border-slate-200 focus:border-indigo-500'
          }`}
        />
        {touched.description && errors.description && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.description}
          </p>
        )}
      </div>

      {/* Project */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Project <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.projectId}
          onChange={(e) => handleChange('projectId', e.target.value)}
          onBlur={() => handleBlur('projectId')}
          className={`block w-full px-4 py-3 border-2 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 bg-white ${
            touched.projectId && errors.projectId
              ? 'border-red-300 focus:border-red-500'
              : 'border-slate-200 focus:border-indigo-500'
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
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.projectId}
          </p>
        )}
      </div>

      {/* Priority and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="block w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="block w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white"
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
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Assignee
          </label>
          <select
            value={formData.assigneeId}
            onChange={(e) => handleChange('assigneeId', e.target.value)}
            className="block w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white"
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
