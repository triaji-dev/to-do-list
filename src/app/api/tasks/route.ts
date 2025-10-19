import { NextRequest, NextResponse } from 'next/server';

import {
  authenticateUser,
  validateRequestBody,
  createServerErrorResponse,
  createSuccessResponse,
} from '@/lib/api-auth';
import { taskQueries } from '@/lib/database';
import { validateTaskCreate, validateTaskQuery } from '@/lib/validation';

// GET /api/tasks - Fetch user's tasks with optional filtering and sorting
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await authenticateUser();
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;
    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const queryValidation = validateTaskQuery(searchParams);
    if (!queryValidation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryValidation.errors },
        { status: 400 }
      );
    }

    const {
      sortBy = 'created_at',
      filterCategory,
      filterStatus,
      search,
    } = queryValidation.data;

    // Fetch tasks
    const tasks = await taskQueries.getUserTasks(userId, {
      sortBy,
      filterCategory,
      filterStatus,
      search,
    });

    return createSuccessResponse(tasks, undefined);
  } catch (error) {
    return createServerErrorResponse('fetch tasks', error);
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await authenticateUser();
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Parse and validate request body
    const bodyResult = await validateRequestBody(request);
    if (!bodyResult.success) {
      return bodyResult.response;
    }

    const { body } = bodyResult;

    // Validate input
    const validation = validateTaskCreate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Prepare sanitized task data
    const taskData = {
      userId,
      ...validation.data,
    };

    // Create task
    const newTask = await taskQueries.createTask(taskData);

    return createSuccessResponse(newTask, 'Task created successfully', 201);
  } catch (error) {
    return createServerErrorResponse('create task', error);
  }
}
