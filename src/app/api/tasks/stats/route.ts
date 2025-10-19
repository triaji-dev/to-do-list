import {
  authenticateUser,
  createServerErrorResponse,
  createSuccessResponse,
} from '@/lib/api-auth';
import { taskQueries } from '@/lib/database';

// GET /api/tasks/stats - Get task statistics for the authenticated user
export async function GET() {
  try {
    // Check authentication
    const authResult = await authenticateUser();
    if (!authResult.success) {
      return authResult.response;
    }

    const { userId } = authResult;

    // Fetch task statistics
    const stats = await taskQueries.getTaskStats(userId);

    // Convert strings to numbers for the response
    const formattedStats = {
      totalTasks: parseInt(stats.total_tasks) || 0,
      completedTasks: parseInt(stats.completed_tasks) || 0,
      pendingTasks: parseInt(stats.pending_tasks) || 0,
      overdueTasks: parseInt(stats.overdue_tasks) || 0,
      completionRate:
        stats.total_tasks > 0
          ? Math.round(
              (parseInt(stats.completed_tasks) / parseInt(stats.total_tasks)) *
                100
            )
          : 0,
    };

    return createSuccessResponse(formattedStats);
  } catch (error) {
    return createServerErrorResponse('fetch task statistics', error);
  }
}
