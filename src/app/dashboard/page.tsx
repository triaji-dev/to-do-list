'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';

import ThemeToggle from '../../components/ThemeToggle';

interface Task {
  id: number;
  user_id: number;
  task_name: string;
  description: string | null;
  is_completed: boolean;
  due_date: string | null;
  priority: string | null;
  category: string | null;
  created_at: string;
}

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state untuk create task
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    priority: 'Medium',
    category: 'Test',
  });

  // Form state untuk update task
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [updateData, setUpdateData] = useState({
    taskName: '',
    description: '',
    isCompleted: false,
    priority: 'Medium',
  });

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // 1. GET /api/tasks - Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    clearMessages();

    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();

      if (response.ok && data.success) {
        setTasks(data.data);
        setSuccess(`✅ GET /api/tasks - Loaded ${data.data.length} tasks`);
      } else {
        setError(
          `❌ GET /api/tasks failed: ${data.error || response.statusText}`
        );
      }
    } catch (err) {
      setError(`❌ GET /api/tasks error: ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. GET /api/tasks/stats - Fetch task statistics
  const fetchStats = useCallback(async () => {
    clearMessages();

    try {
      const response = await fetch('/api/tasks/stats');
      const data = await response.json();

      if (response.ok && data.success) {
        setStats(data.data);
        setSuccess(`✅ GET /api/tasks/stats - Stats loaded successfully`);
      } else {
        setError(
          `❌ GET /api/tasks/stats failed: ${data.error || response.statusText}`
        );
      }
    } catch (err) {
      setError(`❌ GET /api/tasks/stats error: ${err}`);
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Load initial data
    fetchTasks();
    fetchStats();
  }, [session, status, router, fetchTasks, fetchStats]);

  // 3. POST /api/tasks - Create new task
  const createTask = async () => {
    if (!newTask.taskName.trim()) {
      setError('Task name is required');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(
          `✅ POST /api/tasks - Task "${newTask.taskName}" created successfully`
        );
        setNewTask({
          taskName: '',
          description: '',
          priority: 'Medium',
          category: 'Test',
        });
        fetchTasks();
        fetchStats();
      } else {
        setError(
          `❌ POST /api/tasks failed: ${data.error || response.statusText}`
        );
      }
    } catch (err) {
      setError(`❌ POST /api/tasks error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // 4. GET /api/tasks/[id] - Get specific task
  const getTask = async (taskId: number) => {
    clearMessages();

    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(
          `✅ GET /api/tasks/${taskId} - Task loaded: "${data.data.task_name}"`
        );
      } else {
        setError(
          `❌ GET /api/tasks/${taskId} failed: ${data.error || response.statusText}`
        );
      }
    } catch (err) {
      setError(`❌ GET /api/tasks/${taskId} error: ${err}`);
    }
  };

  // 5. PUT /api/tasks/[id] - Update task
  const updateTask = async () => {
    if (!editingTask) return;

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(
          `✅ PUT /api/tasks/${editingTask.id} - Task updated successfully`
        );
        setEditingTask(null);
        fetchTasks();
        fetchStats();
      } else {
        setError(
          `❌ PUT /api/tasks/${editingTask.id} failed: ${data.error || response.statusText}`
        );
      }
    } catch (err) {
      setError(`❌ PUT /api/tasks/${editingTask.id} error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // 6. DELETE /api/tasks/[id] - Delete task
  const deleteTask = async (taskId: number, taskName: string) => {
    if (!confirm(`Delete task "${taskName}"?`)) return;

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(
          `✅ DELETE /api/tasks/${taskId} - Task "${taskName}" deleted successfully`
        );
        fetchTasks();
        fetchStats();
      } else {
        setError(
          `❌ DELETE /api/tasks/${taskId} failed: ${data.error || response.statusText}`
        );
      }
    } catch (err) {
      setError(`❌ DELETE /api/tasks/${taskId} error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setUpdateData({
      taskName: task.task_name,
      description: task.description || '',
      isCompleted: task.is_completed,
      priority: task.priority || 'Medium',
    });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setUpdateData({
      taskName: '',
      description: '',
      isCompleted: false,
      priority: 'Medium',
    });
  };

  if (status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8 transition-colors dark:bg-gray-900'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800'>
          <div className='mb-4 flex items-start justify-between'>
            <div className='flex-1'>
              <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>
                🧪 API Testing Dashboard
              </h1>
              <p className='text-gray-600 dark:text-gray-300'>
                Welcome, <strong>{session.user?.name}</strong> (
                {session.user?.email})
              </p>
              <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                Testing all authenticated API endpoints for task management
              </p>
            </div>
            <div className='ml-4 flex items-center space-x-3'>
              <Link
                href='/'
                className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              >
                ← Back to Homepage
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className='mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'>
            {error}
          </div>
        )}

        {success && (
          <div className='mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'>
            {success}
          </div>
        )}

        {loading && (
          <div className='border-theme-primary-200 dark:border-theme-primary-800 bg-theme-primary-50 dark:bg-theme-primary-900/20 text-theme-primary-700 dark:text-theme-primary-400 mb-4 rounded border px-4 py-3'>
            ⏳ API call in progress...
          </div>
        )}

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Left Column: API Testing */}
          <div className='space-y-6'>
            {/* Stats Display */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800'>
              <h2 className='mb-4 flex items-center text-xl font-semibold text-gray-900 dark:text-white'>
                📊 Task Statistics
                <button
                  onClick={fetchStats}
                  className='ml-auto rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600'
                  disabled={loading}
                >
                  Refresh Stats
                </button>
              </h2>

              {stats ? (
                <div className='grid grid-cols-2 gap-4'>
                  <div className='rounded bg-gray-50 p-3 text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {stats.totalTasks}
                    </div>
                    <div className='text-sm text-gray-600'>Total</div>
                  </div>
                  <div className='rounded bg-gray-50 p-3 text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {stats.completedTasks}
                    </div>
                    <div className='text-sm text-gray-600'>Completed</div>
                  </div>
                  <div className='rounded bg-gray-50 p-3 text-center'>
                    <div className='text-2xl font-bold text-yellow-600'>
                      {stats.pendingTasks}
                    </div>
                    <div className='text-sm text-gray-600'>Pending</div>
                  </div>
                  <div className='rounded bg-gray-50 p-3 text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {stats.completionRate}%
                    </div>
                    <div className='text-sm text-gray-600'>Rate</div>
                  </div>
                </div>
              ) : (
                <div className='py-8 text-center text-gray-500'>
                  No stats available. Click &quot;Refresh Stats&quot; to load.
                </div>
              )}
            </div>

            {/* Create Task Form */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
                ➕ Create New Task
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Task Name *
                  </label>
                  <input
                    type='text'
                    value={newTask.taskName}
                    onChange={(e) =>
                      setNewTask({ ...newTask, taskName: e.target.value })
                    }
                    className='w-full rounded border border-gray-300 px-3 py-2'
                    placeholder='Enter task name...'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className='w-full rounded border border-gray-300 px-3 py-2'
                    rows={2}
                    placeholder='Task description...'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className='w-full rounded border border-gray-300 px-3 py-2'
                    >
                      <option value='Low'>Low</option>
                      <option value='Medium'>Medium</option>
                      <option value='High'>High</option>
                    </select>
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Category
                    </label>
                    <input
                      type='text'
                      value={newTask.category}
                      onChange={(e) =>
                        setNewTask({ ...newTask, category: e.target.value })
                      }
                      className='w-full rounded border border-gray-300 px-3 py-2'
                      placeholder='Category...'
                    />
                  </div>
                </div>

                <button
                  onClick={createTask}
                  disabled={loading || !newTask.taskName.trim()}
                  className='w-full rounded bg-green-500 py-2 text-white hover:bg-green-600 disabled:opacity-50'
                >
                  🚀 Test POST /api/tasks
                </button>
              </div>
            </div>

            {/* Update Task Form */}
            {editingTask && (
              <div className='rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800'>
                <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
                  ✏️ Update Task #{editingTask.id}
                </h2>

                <div className='space-y-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Task Name
                    </label>
                    <input
                      type='text'
                      value={updateData.taskName}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          taskName: e.target.value,
                        })
                      }
                      className='w-full rounded border border-gray-300 px-3 py-2'
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Description
                    </label>
                    <textarea
                      value={updateData.description}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          description: e.target.value,
                        })
                      }
                      className='w-full rounded border border-gray-300 px-3 py-2'
                      rows={2}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>
                        Priority
                      </label>
                      <select
                        value={updateData.priority}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            priority: e.target.value,
                          })
                        }
                        className='w-full rounded border border-gray-300 px-3 py-2'
                      >
                        <option value='Low'>Low</option>
                        <option value='Medium'>Medium</option>
                        <option value='High'>High</option>
                      </select>
                    </div>

                    <div>
                      <label className='mt-6 flex items-center'>
                        <input
                          type='checkbox'
                          checked={updateData.isCompleted}
                          onChange={(e) =>
                            setUpdateData({
                              ...updateData,
                              isCompleted: e.target.checked,
                            })
                          }
                          className='mr-2'
                        />
                        <span className='text-sm font-medium text-gray-700'>
                          Completed
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className='flex space-x-3'>
                    <button
                      onClick={updateTask}
                      disabled={loading}
                      className='flex-1 rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-50'
                    >
                      🚀 Test PUT /api/tasks/{editingTask.id}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className='flex-1 rounded bg-gray-500 py-2 text-white hover:bg-gray-600'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Tasks List */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>📋 Tasks List</h2>
              <button
                onClick={fetchTasks}
                className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
                disabled={loading}
              >
                🔄 Refresh Tasks
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className='py-8 text-center text-gray-500'>
                No tasks available. Create a task to get started!
              </div>
            ) : (
              <div className='space-y-3'>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className='rounded border p-4 hover:bg-gray-50'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h3 className='font-medium text-gray-900'>
                          #{task.id} - {task.task_name}
                        </h3>
                        {task.description && (
                          <p className='mt-1 text-sm text-gray-600'>
                            {task.description}
                          </p>
                        )}
                        <div className='mt-2 flex items-center space-x-4 text-xs text-gray-500'>
                          <span
                            className={`rounded px-2 py-1 ${
                              task.is_completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {task.is_completed ? '✅ Completed' : '⏳ Pending'}
                          </span>
                          {task.priority && (
                            <span className='rounded bg-blue-100 px-2 py-1 text-blue-800'>
                              {task.priority}
                            </span>
                          )}
                          {task.category && (
                            <span className='rounded bg-gray-100 px-2 py-1 text-gray-800'>
                              {task.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className='ml-4 flex space-x-2'>
                        <button
                          onClick={() => getTask(task.id)}
                          className='rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600'
                          title={`Test GET /api/tasks/${task.id}`}
                        >
                          👁️ Get
                        </button>
                        <button
                          onClick={() => startEditing(task)}
                          className='rounded bg-yellow-500 px-2 py-1 text-xs text-white hover:bg-yellow-600'
                          title={`Test PUT /api/tasks/${task.id}`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id, task.task_name)}
                          className='rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600'
                          title={`Test DELETE /api/tasks/${task.id}`}
                        >
                          🗑️ Del
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className='mt-8 rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>
            🔗 API Endpoints Being Tested
          </h2>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
            <div className='space-y-2'>
              <div>
                <span className='rounded bg-green-100 px-2 py-1 font-mono'>
                  GET
                </span>{' '}
                /api/tasks - Fetch all tasks
              </div>
              <div>
                <span className='rounded bg-blue-100 px-2 py-1 font-mono'>
                  POST
                </span>{' '}
                /api/tasks - Create new task
              </div>
              <div>
                <span className='rounded bg-green-100 px-2 py-1 font-mono'>
                  GET
                </span>{' '}
                /api/tasks/stats - Get statistics
              </div>
            </div>
            <div className='space-y-2'>
              <div>
                <span className='rounded bg-green-100 px-2 py-1 font-mono'>
                  GET
                </span>{' '}
                /api/tasks/[id] - Get specific task
              </div>
              <div>
                <span className='rounded bg-yellow-100 px-2 py-1 font-mono'>
                  PUT
                </span>{' '}
                /api/tasks/[id] - Update task
              </div>
              <div>
                <span className='rounded bg-red-100 px-2 py-1 font-mono'>
                  DELETE
                </span>{' '}
                /api/tasks/[id] - Delete task
              </div>
            </div>
          </div>
          <p className='mt-4 text-gray-600'>
            All endpoints require NextAuth session authentication. Each
            operation will show success/error messages with API details.
          </p>
        </div>
      </div>
    </div>
  );
}
