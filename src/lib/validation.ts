/**
 * Comprehensive validation utilities for the To-Do List application
 * Provides type-safe validation for all user inputs
 */

// Validation result types
interface ValidationSuccess {
  success: true;
  data: any;
}

interface ValidationError {
  success: false;
  errors: string[];
}

type ValidationResult = ValidationSuccess | ValidationError;

// Task validation types
interface TaskCreateInput {
  taskName: string;
  description?: string;
  dueDate?: string | null;
  priority?: 'Low' | 'Medium' | 'High';
  category?: string | null;
}

interface TaskUpdateInput {
  taskName?: string;
  description?: string | null;
  isCompleted?: boolean;
  dueDate?: string | null;
  priority?: 'Low' | 'Medium' | 'High';
  category?: string | null;
}

/**
 * Validates task creation input
 */
export function validateTaskCreate(data: any): ValidationResult {
  const errors: string[] = [];
  const cleanData: TaskCreateInput = {} as TaskCreateInput;

  // Required: taskName
  if (!data.taskName || typeof data.taskName !== 'string') {
    errors.push('Task name is required and must be a string');
  } else {
    const trimmed = data.taskName.trim();
    if (trimmed.length === 0) {
      errors.push('Task name cannot be empty');
    } else if (trimmed.length > 255) {
      errors.push('Task name must be 255 characters or less');
    } else {
      cleanData.taskName = trimmed;
    }
  }

  // Optional: description
  if (data.description !== undefined) {
    if (data.description === null || data.description === '') {
      cleanData.description = undefined;
    } else if (typeof data.description !== 'string') {
      errors.push('Description must be a string');
    } else {
      const trimmed = data.description.trim();
      cleanData.description = trimmed.length > 0 ? trimmed : undefined;
    }
  }

  // Optional: dueDate
  if (data.dueDate !== undefined && data.dueDate !== null) {
    if (typeof data.dueDate !== 'string') {
      errors.push('Due date must be a string or null');
    } else {
      const date = new Date(data.dueDate);
      if (isNaN(date.getTime())) {
        errors.push('Due date must be a valid date');
      } else {
        cleanData.dueDate = data.dueDate;
      }
    }
  }

  // Optional: priority
  if (data.priority !== undefined) {
    if (!['Low', 'Medium', 'High'].includes(data.priority)) {
      errors.push('Priority must be one of: Low, Medium, High');
    } else {
      cleanData.priority = data.priority;
    }
  } else {
    cleanData.priority = 'Medium'; // Default priority
  }

  // Optional: category
  if (data.category !== undefined) {
    if (data.category === null || data.category === '') {
      cleanData.category = undefined;
    } else if (typeof data.category !== 'string') {
      errors.push('Category must be a string');
    } else {
      const trimmed = data.category.trim();
      if (trimmed.length > 100) {
        errors.push('Category must be 100 characters or less');
      } else {
        cleanData.category = trimmed.length > 0 ? trimmed : undefined;
      }
    }
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: cleanData };
}

/**
 * Validates task update input
 */
export function validateTaskUpdate(data: any): ValidationResult {
  const errors: string[] = [];
  const cleanData: TaskUpdateInput = {};

  // Optional: taskName
  if (data.taskName !== undefined) {
    if (typeof data.taskName !== 'string') {
      errors.push('Task name must be a string');
    } else {
      const trimmed = data.taskName.trim();
      if (trimmed.length === 0) {
        errors.push('Task name cannot be empty');
      } else if (trimmed.length > 255) {
        errors.push('Task name must be 255 characters or less');
      } else {
        cleanData.taskName = trimmed;
      }
    }
  }

  // Optional: description
  if (data.description !== undefined) {
    if (data.description === null || data.description === '') {
      cleanData.description = null;
    } else if (typeof data.description !== 'string') {
      errors.push('Description must be a string or null');
    } else {
      const trimmed = data.description.trim();
      cleanData.description = trimmed.length > 0 ? trimmed : null;
    }
  }

  // Optional: isCompleted
  if (data.isCompleted !== undefined) {
    if (typeof data.isCompleted !== 'boolean') {
      errors.push('isCompleted must be a boolean');
    } else {
      cleanData.isCompleted = data.isCompleted;
    }
  }

  // Optional: dueDate
  if (data.dueDate !== undefined) {
    if (data.dueDate === null) {
      cleanData.dueDate = null;
    } else if (typeof data.dueDate !== 'string') {
      errors.push('Due date must be a string or null');
    } else {
      const date = new Date(data.dueDate);
      if (isNaN(date.getTime())) {
        errors.push('Due date must be a valid date or null');
      } else {
        cleanData.dueDate = data.dueDate;
      }
    }
  }

  // Optional: priority
  if (data.priority !== undefined) {
    if (!['Low', 'Medium', 'High'].includes(data.priority)) {
      errors.push('Priority must be one of: Low, Medium, High');
    } else {
      cleanData.priority = data.priority;
    }
  }

  // Optional: category
  if (data.category !== undefined) {
    if (data.category === null || data.category === '') {
      cleanData.category = null;
    } else if (typeof data.category !== 'string') {
      errors.push('Category must be a string or null');
    } else {
      const trimmed = data.category.trim();
      if (trimmed.length > 100) {
        errors.push('Category must be 100 characters or less');
      } else {
        cleanData.category = trimmed.length > 0 ? trimmed : null;
      }
    }
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: cleanData };
}

/**
 * Validates query parameters for task filtering/sorting
 */
export function validateTaskQuery(
  searchParams: URLSearchParams
): ValidationResult {
  const errors: string[] = [];
  const cleanData: {
    sortBy?: string;
    filterCategory?: string;
    filterStatus?: boolean;
    search?: string;
  } = {};

  // sortBy validation
  const sortBy = searchParams.get('sortBy');
  if (sortBy) {
    const validSortOptions = [
      'created_at',
      'due_date',
      'priority',
      'task_name',
    ];
    if (validSortOptions.includes(sortBy)) {
      cleanData.sortBy = sortBy;
    } else {
      errors.push(`sortBy must be one of: ${validSortOptions.join(', ')}`);
    }
  }

  // category filter validation
  const category = searchParams.get('category');
  if (category) {
    const trimmed = category.trim();
    if (trimmed.length > 0 && trimmed.length <= 100) {
      cleanData.filterCategory = trimmed;
    } else {
      errors.push('Category filter must be 1-100 characters');
    }
  }

  // completed status filter validation
  const completed = searchParams.get('completed');
  if (completed) {
    if (completed === 'true') {
      cleanData.filterStatus = true;
    } else if (completed === 'false') {
      cleanData.filterStatus = false;
    } else {
      errors.push('completed filter must be "true" or "false"');
    }
  }

  // search query validation
  const search = searchParams.get('search');
  if (search) {
    const trimmed = search.trim();
    if (trimmed.length > 0 && trimmed.length <= 255) {
      cleanData.search = trimmed;
    } else {
      errors.push('Search query must be 1-255 characters');
    }
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: cleanData };
}

/**
 * Validates and sanitizes general text input
 */
export function validateText(
  input: any,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    fieldName?: string;
  } = {}
): ValidationResult {
  const {
    required = false,
    minLength = 0,
    maxLength = 1000,
    fieldName = 'Text',
  } = options;

  const errors: string[] = [];

  if (required && (input === undefined || input === null)) {
    errors.push(`${fieldName} is required`);
    return { success: false, errors };
  }

  if (input === undefined || input === null) {
    return { success: true, data: null };
  }

  if (typeof input !== 'string') {
    errors.push(`${fieldName} must be a string`);
    return { success: false, errors };
  }

  const trimmed = input.trim();

  if (required && trimmed.length === 0) {
    errors.push(`${fieldName} cannot be empty`);
  }

  if (trimmed.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters`);
  }

  if (trimmed.length > maxLength) {
    errors.push(`${fieldName} must be ${maxLength} characters or less`);
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: trimmed.length > 0 ? trimmed : null };
}

/**
 * Validates email format
 */
export function validateEmail(email: any): ValidationResult {
  const errors: string[] = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
    return { success: false, errors };
  }

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    errors.push('Please provide a valid email address');
  }

  if (trimmed.length > 255) {
    errors.push('Email must be 255 characters or less');
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: trimmed };
}

/**
 * Validates password strength
 */
export function validatePassword(password: any): ValidationResult {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    errors.push('Password is required and must be a string');
    return { success: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be 128 characters or less');
  }

  // Check for at least one number, one letter
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one letter and one number');
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: password };
}

// Export validation result types for use in other files
export type {
  ValidationResult,
  ValidationSuccess,
  ValidationError,
  TaskCreateInput,
  TaskUpdateInput,
};
