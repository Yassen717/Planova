'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateDateRange,
  validateFields,
  hasErrors,
  ValidationResult,
} from '@/lib/utils/validationHelpers';

export interface ProjectFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  onSubmit?: (data: any) => Promise<void>;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'ACTIVE',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
  });

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
      case 'startDate':
        result = validateRequired(formData.startDate, 'Start date');
        break;
      case 'endDate':
        if (formData.endDate) {
          result = validateDateRange(formData.startDate, formData.endDate);
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
      startDate: (value: string) => validateRequired(value, 'Start date'),
    };

    const newErrors = validateFields(formData, validators);
    
    // Validate date range
    if (formData.endDate) {
      const dateRangeResult = validateDateRange(formData.startDate, formData.endDate);
      if (!dateRangeResult.isValid && dateRangeResult.error) {
        newErrors.endDate = dateRangeResult.error;
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
      startDate: true,
      endDate: true,
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
        const url = initialData?.id ? `/api/projects/${initialData.id}` : '/api/projects';
        const method = initialData?.id ? 'PATCH' : 'POST';
        
        // Get first user as owner for new projects
        let dataToSend: any = formData;
        if (!initialData?.id) {
          // Fetch first user to use as owner
          const usersRes = await fetch('/api/users');
          const users = await usersRes.json();
          const firstUser = users.data?.[0] || users[0];
          
          if (!firstUser) {
            throw new Error('No users found. Please create a user first.');
          }
          
          dataToSend = { ...formData, ownerId: firstUser.id };
        }
        
        console.log('Sending data:', dataToSend); // Debug log
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('API Error:', response.status, errorData);
          throw new Error(errorData?.error || 'Failed to save project');
        }

        showToast(
          initialData?.id ? 'Project updated successfully' : 'Project created successfully',
          'success'
        );
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save project. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Project Title"
        type="text"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        error={touched.title ? errors.title : undefined}
        placeholder="Enter project title"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Enter project description"
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          onBlur={() => handleBlur('startDate')}
          error={touched.startDate ? errors.startDate : undefined}
          required
        />

        <Input
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          onBlur={() => handleBlur('endDate')}
          error={touched.endDate ? errors.endDate : undefined}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex-1"
        >
          {initialData?.id ? 'Update Project' : 'Create Project'}
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

export default ProjectForm;
