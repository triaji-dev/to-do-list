import { NextRequest, NextResponse } from 'next/server';

import {
  authenticateUser,
  validateTaskId,
  validateRequestBody,
  createServerErrorResponse,
  createSuccessResponse,
} from '@/lib/api-auth';
import { taskQueries } from '@/lib/database';
import { validateTaskUpdate } from '@/lib/validation';

// GET /api/tasks/[id] - Get specific task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authResult = await authenticateUser();
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Validate task ID
    const taskIdResult = validateTaskId(params.id);
    if (!taskIdResult.success) {
      return taskIdResult.response;
    }

    const { taskId } = taskIdResult;

    // Fetch task
    const task = await taskQueries.getTaskById(taskId, userId);

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    return createSuccessResponse(task);
  } catch (error) {
    return createServerErrorResponse('fetch task', error);
  }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authResult = await authenticateUser();
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Validate task ID
    const taskIdResult = validateTaskId(params.id);
    if (!taskIdResult.success) {
      return taskIdResult.response;
    }

    const { taskId } = taskIdResult;

    // Parse and validate request body
    const bodyResult = await validateRequestBody(request);
    if (!bodyResult.success) {
      return bodyResult.response;
    }

    const { body } = bodyResult;

    // Validate input
    const validation = validateTaskUpdate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Use validated and sanitized data
    const updateData = validation.data;

    // Update task
    const updatedTask = await taskQueries.updateTask(
      taskId,
      userId,
      updateData
    );

    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    return createSuccessResponse(updatedTask, 'Task updated successfully');
  } catch (error) {
    return createServerErrorResponse('update task', error);
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authResult = await authenticateUser();
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Validate task ID
    const taskIdResult = validateTaskId(params.id);
    if (!taskIdResult.success) {
      return taskIdResult.response;
    }

    const { taskId } = taskIdResult;

    // Delete task
    const deletedTask = await taskQueries.deleteTask(taskId, userId);

    if (!deletedTask) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    return createSuccessResponse(
      { id: deletedTask.id },
      'Task deleted successfully'
    );
  } catch (error) {
    return createServerErrorResponse('delete task', error);
  }
}
