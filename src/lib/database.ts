import { sql } from '@vercel/postgres';

// Database connection utility
export { sql };

// Query helper function with error handling
export async function query(text: string, params: any[] = []) {
  try {
    const start = Date.now();
    const result = await sql.query(text, params);
    const duration = Date.now() - start;

    // Log query in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query:', {
        text,
        params,
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }

    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Database initialization and table creation
export async function initializeDatabase() {
  try {
    // Create Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create Tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        task_name VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        due_date TIMESTAMP,
        priority VARCHAR(10) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);`;

    console.log('Database tables and indexes created successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// User-related database operations
export const userQueries = {
  // Create new user
  async createUser(email: string, name?: string, passwordHash?: string) {
    const result = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email}, ${name}, ${passwordHash})
      RETURNING id, email, name, created_at;
    `;
    return result.rows[0];
  },

  // Find user by email
  async findUserByEmail(email: string) {
    const result = await sql`
      SELECT * FROM users 
      WHERE email = ${email}
      LIMIT 1;
    `;
    return result.rows[0];
  },

  // Find user by ID
  async findUserById(id: number) {
    const result = await sql`
      SELECT id, email, name, created_at FROM users 
      WHERE id = ${id}
      LIMIT 1;
    `;
    return result.rows[0];
  },

  // Update user profile
  async updateUser(id: number, updates: { name?: string; email?: string }) {
    const result = await sql`
      UPDATE users 
      SET name = COALESCE(${updates.name}, name),
          email = COALESCE(${updates.email}, email)
      WHERE id = ${id}
      RETURNING id, email, name, created_at;
    `;
    return result.rows[0];
  },
};

// Task-related database operations
export const taskQueries = {
  // Create new task
  async createTask(taskData: {
    userId: number;
    taskName: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    category?: string;
  }) {
    const result = await sql`
      INSERT INTO tasks (user_id, task_name, description, due_date, priority, category)
      VALUES (${taskData.userId}, ${taskData.taskName}, ${taskData.description}, 
              ${taskData.dueDate}, ${taskData.priority || 'Medium'}, ${taskData.category})
      RETURNING *;
    `;
    return result.rows[0];
  },

  // Get all tasks for a user with optional filtering and sorting
  async getUserTasks(
    userId: number,
    options: {
      sortBy?: string;
      filterCategory?: string;
      filterStatus?: boolean;
      search?: string;
    } = {}
  ) {
    const {
      sortBy = 'created_at',
      filterCategory,
      filterStatus,
      search,
    } = options;

    let query = `
      SELECT * FROM tasks 
      WHERE user_id = $1
    `;
    const params: any[] = [userId];
    let paramIndex = 2;

    // Add filters
    if (filterCategory) {
      query += ` AND category = $${paramIndex}`;
      params.push(filterCategory);
      paramIndex++;
    }

    if (filterStatus !== undefined) {
      query += ` AND is_completed = $${paramIndex}`;
      params.push(filterStatus);
      paramIndex++;
    }

    if (search) {
      query += ` AND (task_name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add sorting
    const sortColumn = [
      'created_at',
      'due_date',
      'priority',
      'task_name',
    ].includes(sortBy)
      ? sortBy
      : 'created_at';

    if (sortBy === 'priority') {
      query += ` ORDER BY CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END`;
    } else {
      query += ` ORDER BY ${sortColumn} DESC`;
    }

    const result = await sql.query(query, params);
    return result.rows;
  },

  // Update task
  async updateTask(
    taskId: number,
    userId: number,
    updates: {
      taskName?: string;
      description?: string;
      isCompleted?: boolean;
      dueDate?: string;
      priority?: string;
      category?: string;
    }
  ) {
    const result = await sql`
      UPDATE tasks 
      SET task_name = COALESCE(${updates.taskName}, task_name),
          description = COALESCE(${updates.description}, description),
          is_completed = COALESCE(${updates.isCompleted}, is_completed),
          due_date = COALESCE(${updates.dueDate}, due_date),
          priority = COALESCE(${updates.priority}, priority),
          category = COALESCE(${updates.category}, category)
      WHERE id = ${taskId} AND user_id = ${userId}
      RETURNING *;
    `;
    return result.rows[0];
  },

  // Delete task
  async deleteTask(taskId: number, userId: number) {
    const result = await sql`
      DELETE FROM tasks 
      WHERE id = ${taskId} AND user_id = ${userId}
      RETURNING id;
    `;
    return result.rows[0];
  },

  // Get task by ID
  async getTaskById(taskId: number, userId: number) {
    const result = await sql`
      SELECT * FROM tasks 
      WHERE id = ${taskId} AND user_id = ${userId}
      LIMIT 1;
    `;
    return result.rows[0];
  },

  // Get task statistics
  async getTaskStats(userId: number) {
    const result = await sql`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN is_completed = false THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN due_date < NOW() AND is_completed = false THEN 1 END) as overdue_tasks
      FROM tasks 
      WHERE user_id = ${userId};
    `;
    return result.rows[0];
  },
};
