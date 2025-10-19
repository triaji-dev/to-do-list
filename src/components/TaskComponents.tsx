'use client';

import { useState, useEffect, useCallback } from 'react';

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

interface AddTaskFormProps {
  onTaskCreated: () => void;
}

export function AddTaskForm({ onTaskCreated }: AddTaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    priority: 'Medium',
    category: 'Personal',
  });

  const createTask = async () => {
    if (!newTask.taskName.trim()) {
      setError('Task name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNewTask({
          taskName: '',
          description: '',
          priority: 'Medium',
          category: 'Personal',
        });
        onTaskCreated();
      } else {
        setError(data.error || 'Failed to create task');
      }
    } catch {
      setError('An error occurred while creating the task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='border-border bg-card rounded-lg border p-6 shadow-sm'>
      <h3 className='text-card-foreground mb-4 text-lg font-semibold'>
        Add New Task
      </h3>

      {error && (
        <div className='border-destructive/20 bg-destructive/10 text-destructive mb-4 rounded border p-3 text-sm'>
          {error}
        </div>
      )}

      <div className='space-y-4'>
        <div>
          <label className='text-card-foreground mb-2 block text-sm font-medium'>
            Task Name *
          </label>
          <input
            type='text'
            value={newTask.taskName}
            onChange={(e) =>
              setNewTask({ ...newTask, taskName: e.target.value })
            }
            className='border-input bg-background text-foreground placeholder-muted-foreground focus:border-ring focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-1 focus:outline-none'
            placeholder='Enter task name...'
          />
        </div>

        <div>
          <label className='text-card-foreground mb-2 block text-sm font-medium'>
            Description
          </label>
          <textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className='border-input bg-background text-foreground placeholder-muted-foreground focus:border-ring focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-1 focus:outline-none'
            rows={2}
            placeholder='Task description...'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-card-foreground mb-2 block text-sm font-medium'>
              Priority
            </label>
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className='border-input bg-background text-foreground focus:border-ring focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-1 focus:outline-none'
            >
              <option value='Low'>Low</option>
              <option value='Medium'>Medium</option>
              <option value='High'>High</option>
            </select>
          </div>

          <div>
            <label className='text-card-foreground mb-2 block text-sm font-medium'>
              Category
            </label>
            <input
              type='text'
              value={newTask.category}
              onChange={(e) =>
                setNewTask({ ...newTask, category: e.target.value })
              }
              className='border-input bg-background text-foreground placeholder-muted-foreground focus:border-ring focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-1 focus:outline-none'
              placeholder='Category...'
            />
          </div>
        </div>

        <button
          onClick={createTask}
          disabled={loading || !newTask.taskName.trim()}
          className='bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50'
        >
          {loading ? 'Creating...' : 'Add Task'}
        </button>
      </div>
    </div>
  );
}

interface TaskListProps {
  refreshTrigger: number;
}

export function TaskList({ refreshTrigger }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();

      if (response.ok && data.success) {
        setTasks(data.data);
      } else {
        setError(data.error || 'Failed to fetch tasks');
      }
    } catch {
      setError('An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTrigger]);

  const toggleTask = async (taskId: number, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      });

      if (response.ok) {
        fetchTasks(); // Refresh tasks
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const deleteTask = async (taskId: number, taskName: string) => {
    if (!confirm(`Delete task "${taskName}"?`)) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks(); // Refresh tasks
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (loading) {
    return (
      <div className='border-border bg-card rounded-lg border p-6'>
        <div className='animate-pulse space-y-3'>
          <div className='bg-muted h-4 w-1/4 rounded'></div>
          <div className='bg-muted h-8 w-full rounded'></div>
          <div className='bg-muted h-8 w-full rounded'></div>
          <div className='bg-muted h-8 w-full rounded'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='border-border bg-card rounded-lg border p-6'>
        <div className='text-destructive text-center'>{error}</div>
      </div>
    );
  }

  return (
    <div className='border-border bg-card rounded-lg border p-6 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-card-foreground text-lg font-semibold'>
          Your Tasks ({tasks.length})
        </h3>
        <button
          onClick={fetchTasks}
          className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-3 py-1 text-sm transition-colors'
        >
          Refresh
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className='text-muted-foreground py-8 text-center'>
          No tasks yet. Add your first task above!
        </div>
      ) : (
        <div className='space-y-3'>
          {tasks.map((task) => (
            <div
              key={task.id}
              className='border-border hover:bg-muted/20 rounded-md border p-4 transition-colors'
            >
              <div className='flex items-start justify-between'>
                <div className='flex flex-1 items-start space-x-3'>
                  <button
                    onClick={() => toggleTask(task.id, task.is_completed)}
                    className={`mt-0.5 h-5 w-5 rounded-md border-2 transition-colors ${
                      task.is_completed
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {task.is_completed && (
                      <svg
                        className='h-3 w-3'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </button>

                  <div className='flex-1'>
                    <h4
                      className={`font-medium ${
                        task.is_completed
                          ? 'text-muted-foreground line-through'
                          : 'text-card-foreground'
                      }`}
                    >
                      {task.task_name}
                    </h4>

                    {task.description && (
                      <p className='text-muted-foreground mt-1 text-sm'>
                        {task.description}
                      </p>
                    )}

                    <div className='mt-2 flex items-center space-x-2 text-xs'>
                      {task.priority && (
                        <span
                          className={`rounded-full px-2 py-1 ${
                            task.priority === 'High'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : task.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      )}

                      {task.category && (
                        <span className='bg-secondary text-secondary-foreground rounded-full px-2 py-1'>
                          {task.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id, task.task_name)}
                  className='text-muted-foreground hover:bg-destructive hover:text-destructive-foreground ml-2 rounded-md p-1 transition-colors'
                  title='Delete task'
                >
                  <svg
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v1H4V5zM3 7h14l-1 9a2 2 0 01-2 2H6a2 2 0 01-2-2L3 7z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
