# Prompt for Advanced To-Do List Application Development

## 🚀 Current Development Status (October 19, 2025)

**FOUNDATION PHASE: ✅ COMPLETED**

- ✅ Next.js 15+ project setup with TypeScript
- ✅ Tailwind CSS configured and optimized
- ✅ All dependencies installed and configured
- ✅ Project structure and documentation complete

**DATABASE PHASE: ✅ COMPLETED**

- ✅ Neon PostgreSQL database connected via Vercel Marketplace
- ✅ Database schema initialized (users, tasks tables)
- ✅ Environment variables configured
- ✅ Database initialization scripts working

**OAUTH PHASE: ⏭️ SKIPPED (Available for Future Implementation)**

- 📋 Complete OAuth setup guides available in `docs/oauth-setup-guide.md`
- 📋 Environment variables template prepared
- 📋 Can be implemented when authentication is needed

**CURRENT FOCUS: 🎯 NextAuth.js Implementation & API Development**

- 🔄 Ready to implement authentication system
- 🔄 Ready to build API routes for task management
- 🔄 Ready to create frontend components

---

## 0. Critical Guideline: Use Latest Versions

**Please ensure that all specified frameworks, libraries, and dependencies are implemented using their latest stable versions as of late 2025.** For example, use the most recent versions of Next.js, React, Tailwind CSS, NextAuth.js, etc. This is crucial to avoid compatibility issues, leverage modern features, and prevent errors caused by outdated configurations.

---

## 1. Project Summary

Build a feature-rich, web-based **To-Do List** application. The application will feature a comprehensive user authentication system (including social logins) and advanced task management functionalities like setting due dates, priorities, sorting, and filtering. The project should be configured for easy deployment on Vercel from a GitHub repository.

---

## 2. Technology Stack

- **Framework**: **Next.js** (use the latest stable version, e.g., v15+).
- **Styling**: **Tailwind CSS** (use the latest stable version with up-to-date configuration).
- **Backend API**: **Vercel Serverless Functions** (Next.js API Routes).
- **Database**: **Vercel Postgres** (latest stable integration).
- **Authentication**: **NextAuth.js** (latest stable version).
- **API Requests (Client-side)**: **Axios** (latest stable version).
- **Form Management**: **React Hook Form** (latest stable version).
- **State Management**: **Zustand** (latest stable version).
- **Notifications**: A modern toast notification library like **`react-hot-toast`** (latest stable version).

---

## 3. Core Features

### 3.1. User Authentication (via NextAuth.js)

- **Credential-based Sign Up/Sign In**:
  - Users must sign up using an **email** and a **password**.
  - Password must have a **minimum of 8 characters**.
- **Social (OAuth) Logins**:
  - Integrate "Sign in with **Google**".
  - Integrate "Sign in with **GitHub**".
  - Integrate "Sign in with **Facebook**".
- **User Flow**: After a successful sign-up or sign-in, the user must be immediately redirected to the main to-do list dashboard.

### 3.2. Advanced Task Management (CRUD+)

- **Create Task**: Users can add a new task with the following fields:
  - `task_name` (string, required)
  - `description` (text, optional)
  - `due_date` (date, optional)
  - `priority` (enum: 'Low', 'Medium', 'High')
  - `category` / `label` (string, optional)
- **Read Tasks**: Display all tasks belonging to the logged-in user.
- **Update Task**:
  - Users can mark a task as `is_completed`.
  - All task fields should be editable using **inline editing** (clicking the text turns it into an input field).
- **Delete Task**: Users can permanently remove a task.
- **Sorting & Filtering**:
  - Provide UI controls (e.g., dropdowns) to sort tasks by `due_date`, `priority`, and `completion_status`.
  - Provide a way to filter tasks, for instance, by `category`.

---

## 4. User Experience (UX) & UI Design

- **General Interactions**:
  - Display a **loading spinner** component whenever data is being fetched from the API.
  - Use **toast notifications** to provide feedback for user actions (e.g., "Task added successfully," "Failed to update task").
- **Empty State**:
  - When a user has no tasks, display a dedicated **empty state component**. This component should have a friendly message and a clear call-to-action button to encourage them to add their first task.
- **Task Card UI**: Each task card in the list must clearly display:
  - Checkbox for completion status.
  - Task Name (main text).
  - Due Date, Priority, and Category/Label (perhaps using small badges or colored icons).
  - An icon or button to reveal the full `description` if it exists.
  - Controls for inline editing and deleting the task.
- **Forms**:
  - Implement client-side validation using **React Hook Form**.
  - Display specific error messages directly below the input fields (e.g., "Task name cannot be empty," "Please enter a valid email").

---

## 5. Database Schema

Implement the following schema for the **Vercel Postgres** database.

- **`Users` Table**:
  - `id` (Primary Key)
  - `name` (String, optional)
  - `email` (String, unique, required)
  - `password_hash` (String, nullable for OAuth users)
  - `created_at` (Timestamp)
- **`Tasks` Table**:
  - `id` (Primary Key)
  - `user_id` (Foreign Key to `Users.id`)
  - `task_name` (String, required)
  - `description` (Text, nullable)
  - `is_completed` (Boolean, default: `false`)
  - `due_date` (Timestamp, nullable)
  - `priority` (String, e.g., 'Low', 'Medium', 'High', default: 'Medium')
  - `category` (String, nullable)
  - `created_at` (Timestamp)

---

## 6. Setup & Deployment on Vercel

This is a critical section. The setup must be beginner-friendly for deployment from a GitHub repository to Vercel.

1.  **Environment Variables**:
    - Create a `.env.local` file in the project root for local development. Do not commit this file to GitHub (ensure it's in `.gitignore`).
    - Define all necessary secrets in this file:

      ```env
      # Vercel Postgres
      POSTGRES_URL="..."

      # NextAuth.js
      NEXTAUTH_URL="http://localhost:3000"
      NEXTAUTH_SECRET="your-strong-random-secret-key" # Generate a strong secret

      # OAuth Providers
      GOOGLE_CLIENT_ID="..."
      GOOGLE_CLIENT_SECRET="..."
      GITHUB_CLIENT_ID="..."
      GITHUB_CLIENT_SECRET="..."
      FACEBOOK_CLIENT_ID="..."
      FACEBOOK_CLIENT_SECRET="..."
      ```

2.  **Vercel Deployment Instructions**:
    - When setting up the project on Vercel, connect it to the GitHub repository.
    - Go to the project's **Settings -> Environment Variables** page on the Vercel dashboard.
    - Add all the variables from the `.env.local` file (e.g., `POSTGRES_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, etc.) one by one. For `NEXTAUTH_URL`, use the production URL provided by Vercel.
    - This ensures that the API keys and database credentials are kept secure and are correctly used in the deployed production environment.

---

## 7. Actionable Tasks for Copilot

1.  Initialize a Next.js project with Tailwind CSS, ensuring the latest stable versions of each are used.
2.  Install and configure all specified libraries (`NextAuth.js`, `Axios`, `React Hook Form`, `Zustand`, `react-hot-toast`), using their latest stable versions.
3.  Set up the NextAuth.js configuration (`/pages/api/auth/[...nextauth].js`) with credential providers and the three specified OAuth providers (Google, GitHub, Facebook).
4.  Define the database schemas and write the API route logic for all task-related CRUD+ operations.
5.  Build the frontend React components (`Navbar`, `TaskCard`, `TaskList`, `TaskForm`, `EmptyState`, `LoadingSpinner`) using the specified UX guidelines.
6.  Implement the state management with Zustand to handle tasks and user session data globally.
7.  Integrate React Hook Form for the task creation/editing forms with the specified validation rules.
8.  Implement the sorting and filtering logic on the main dashboard.
9.  Ensure all API requests use Axios and include proper loading state and error handling via toast notifications.

---

## 8. Backend API Architecture & Implementation

### 8.1. API Route Structure

The application uses Next.js API routes following RESTful conventions:

```
/api/
├── auth/
│   ├── [...nextauth].js      # NextAuth configuration (OAuth + credentials)
│   └── register.js           # POST - User registration endpoint
├── tasks/
│   ├── index.js              # GET (fetch tasks), POST (create task)
│   └── [id].js               # PUT (update task), DELETE (delete task)
└── user/
    └── profile.js            # GET/PUT user profile management
```

### 8.2. Authentication API Workflow

**Registration Flow** (`POST /api/auth/register`):

1. Validate input (email format, password length ≥8 characters)
2. Check if email already exists in database
3. Hash password using bcrypt
4. Insert new user record into Users table
5. Return success response (exclude password hash)

**Login Flow** (handled by NextAuth.js):

1. **Credentials**: Verify email/password against database
2. **OAuth**: Handle Google/GitHub/Facebook authentication
3. Create secure session with JWT
4. Redirect to dashboard upon successful authentication

### 8.3. Task Management API Endpoints

**Create Task** (`POST /api/tasks`):

```javascript
// Request Body
{
  "task_name": "string (required)",
  "description": "string (optional)",
  "due_date": "ISO date string (optional)",
  "priority": "Low|Medium|High (default: Medium)",
  "category": "string (optional)"
}

// Response
{
  "success": true,
  "task": {
    "id": 1,
    "task_name": "Learn Next.js",
    "user_id": 123,
    "created_at": "2025-10-19T10:00:00Z",
    // ... other fields
  }
}
```

**Fetch Tasks** (`GET /api/tasks`):

- Query Parameters: `?sort=due_date&filter=category&status=completed`
- Returns array of tasks belonging to authenticated user
- Supports sorting by: `due_date`, `priority`, `created_at`, `completion_status`
- Supports filtering by: `category`, `priority`, `is_completed`

**Update Task** (`PUT /api/tasks/[id]`):

- Allows partial updates (only send changed fields)
- Common updates: toggle `is_completed`, edit `task_name`, change `priority`
- Validates user ownership before updating

**Delete Task** (`DELETE /api/tasks/[id]`):

- Permanently removes task from database
- Validates user ownership before deletion
- Returns confirmation response

### 8.4. Database Queries & Operations

**CRUD Operations with SQL:**

```sql
-- Create Task
INSERT INTO tasks (user_id, task_name, description, due_date, priority, category, created_at)
VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *;

-- Read Tasks (with filtering)
SELECT * FROM tasks
WHERE user_id = $1
  AND ($2::text IS NULL OR category = $2)
  AND ($3::boolean IS NULL OR is_completed = $3)
ORDER BY
  CASE WHEN $4 = 'priority' THEN
    CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END
  END,
  due_date ASC NULLS LAST,
  created_at DESC;

-- Update Task
UPDATE tasks
SET task_name = COALESCE($3, task_name),
    description = COALESCE($4, description),
    is_completed = COALESCE($5, is_completed),
    priority = COALESCE($6, priority),
    category = COALESCE($7, category),
    due_date = COALESCE($8, due_date)
WHERE id = $1 AND user_id = $2
RETURNING *;

-- Delete Task
DELETE FROM tasks
WHERE id = $1 AND user_id = $2;
```

### 8.5. Error Handling & Security

**Authentication Middleware:**

```javascript
// Protect API routes
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Continue with protected logic
}
```

**Input Validation:**

```javascript
// Validate task creation
const taskSchema = {
  task_name: { required: true, maxLength: 255 },
  description: { maxLength: 1000 },
  priority: { enum: ['Low', 'Medium', 'High'] },
  due_date: { type: 'date' },
};
```

**Database Security:**

- Use parameterized queries to prevent SQL injection
- Validate user ownership for all task operations
- Implement rate limiting for API endpoints
- Hash passwords with bcrypt (salt rounds: 12)

---

## 9. Testing Strategy & Implementation

### 9.1. Development Testing Setup

**Testing Dependencies:**

```json
{
  "devDependencies": {
    "jest": "^29.x.x",
    "@testing-library/react": "^14.x.x",
    "@testing-library/jest-dom": "^6.x.x",
    "@testing-library/user-event": "^14.x.x",
    "supertest": "^6.x.x",
    "@databases/pg-test": "^3.x.x",
    "msw": "^2.x.x"
  }
}
```

### 9.2. API Testing (Backend)

**Unit Tests for API Routes:**

```javascript
// tests/api/tasks.test.js
import { createTestDatabase } from '@databases/pg-test';
import handler from '../../pages/api/tasks';
import { createMocks } from 'node-mocks-http';

describe('/api/tasks', () => {
  let db, userId;

  beforeEach(async () => {
    db = await createTestDatabase();
    // Setup test user and session
  });

  test('POST /api/tasks - creates new task', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        task_name: 'Test Task',
        priority: 'High',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toMatchObject({
      success: true,
      task: expect.objectContaining({
        task_name: 'Test Task',
        priority: 'High',
      }),
    });
  });

  // Additional tests for GET, PUT, DELETE operations
});
```

**Integration Tests with Database:**

```javascript
// tests/integration/task-crud.test.js
describe('Task CRUD Operations', () => {
  test('complete task workflow', async () => {
    // 1. Create task
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ task_name: 'Integration Test Task' })
      .expect(201);

    const taskId = createResponse.body.task.id;

    // 2. Fetch tasks
    const fetchResponse = await request(app).get('/api/tasks').expect(200);

    expect(fetchResponse.body.tasks).toHaveLength(1);

    // 3. Update task
    await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ is_completed: true })
      .expect(200);

    // 4. Delete task
    await request(app).delete(`/api/tasks/${taskId}`).expect(200);

    // 5. Verify deletion
    const finalFetch = await request(app).get('/api/tasks').expect(200);

    expect(finalFetch.body.tasks).toHaveLength(0);
  });
});
```

### 9.3. Frontend Testing (Components)

**Component Unit Tests:**

```javascript
// tests/components/TaskCard.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../components/TaskCard';

const mockTask = {
  id: 1,
  task_name: 'Test Task',
  description: 'Test Description',
  is_completed: false,
  priority: 'High',
  due_date: '2025-10-25',
};

test('TaskCard renders correctly', () => {
  render(
    <TaskCard task={mockTask} onUpdate={jest.fn()} onDelete={jest.fn()} />
  );

  expect(screen.getByText('Test Task')).toBeInTheDocument();
  expect(screen.getByText('High')).toBeInTheDocument();
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});

test('TaskCard handles completion toggle', async () => {
  const mockUpdate = jest.fn();
  render(
    <TaskCard task={mockTask} onUpdate={mockUpdate} onDelete={jest.fn()} />
  );

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  expect(mockUpdate).toHaveBeenCalledWith(1, { is_completed: true });
});
```

**Form Testing with React Hook Form:**

```javascript
// tests/components/TaskForm.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../../components/TaskForm';

test('TaskForm validation works correctly', async () => {
  const user = userEvent.setup();
  render(<TaskForm onSubmit={jest.fn()} />);

  // Try to submit empty form
  const submitButton = screen.getByText('Add Task');
  await user.click(submitButton);

  // Check for validation error
  expect(screen.getByText('Task name is required')).toBeInTheDocument();

  // Fill valid data
  await user.type(screen.getByPlaceholderText('Task name'), 'Valid Task');
  await user.click(submitButton);

  // Validation error should disappear
  await waitFor(() => {
    expect(screen.queryByText('Task name is required')).not.toBeInTheDocument();
  });
});
```

### 9.4. Manual Testing Procedures

**Local Development Testing Checklist:**

1. **Authentication Testing:**

```bash
# Test user registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test different OAuth providers
# - Visit http://localhost:3000/auth/signin
# - Test Google, GitHub, Facebook sign-in buttons
# - Verify successful redirect to dashboard
```

2. **Task Management Testing:**

```bash
# Create task with all fields
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION" \
  -d '{
    "task_name": "Complete Project",
    "description": "Finish the to-do app",
    "due_date": "2025-10-30T10:00:00Z",
    "priority": "High",
    "category": "Work"
  }'

# Test sorting and filtering
curl "http://localhost:3000/api/tasks?sort=priority&filter=Work&status=false"
```

3. **UI/UX Testing:**
   - Test responsive design on mobile (DevTools)
   - Verify toast notifications appear correctly
   - Test inline editing functionality
   - Verify loading states during API calls
   - Test empty state when no tasks exist

### 9.5. Performance & Load Testing

**Database Performance:**

```javascript
// tests/performance/database.test.js
describe('Database Performance', () => {
  test('fetching 1000 tasks should complete within 500ms', async () => {
    // Create 1000 test tasks
    const tasks = Array.from({ length: 1000 }, (_, i) => ({
      task_name: `Task ${i}`,
      user_id: testUserId,
    }));

    await db.insertMany('tasks', tasks);

    const startTime = Date.now();
    const result = await db.query('SELECT * FROM tasks WHERE user_id = $1', [
      testUserId,
    ]);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(500);
    expect(result.length).toBe(1000);
  });
});
```

### 9.6. Test Commands & Scripts

**Package.json Scripts:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:api": "jest tests/api",
    "test:components": "jest tests/components",
    "test:integration": "jest tests/integration"
  }
}
```

---

## 🎯 IMMEDIATE NEXT STEPS (Ready to Implement)

### Step 3: NextAuth.js Implementation

**Priority Tasks:**

1. **Install NextAuth.js Dependencies**

   ```bash
   npm install next-auth@latest
   npm install bcryptjs@latest
   ```

2. **Create NextAuth.js Configuration**
   - Setup `/api/auth/[...nextauth].js`
   - Configure credentials provider for email/password
   - Setup database adapter for user sessions
   - Configure JWT and session strategies

3. **Create Authentication Pages**
   - `/pages/auth/signin.js` - Login page with form
   - `/pages/auth/signup.js` - Registration page
   - `/pages/auth/error.js` - Error handling page

4. **Implement Registration API**
   - `/api/auth/register.js` - User registration endpoint
   - Password hashing with bcryptjs
   - Email validation and duplicate checking

### Step 4: API Routes Development

1. **Task Management API**
   - `/api/tasks/index.js` - GET (fetch) & POST (create)
   - `/api/tasks/[id].js` - PUT (update) & DELETE (remove)
   - Authentication middleware integration
   - Database CRUD operations

2. **User Management API**
   - `/api/user/profile.js` - User profile management
   - Session validation and user data retrieval

### Step 5: Frontend Components

1. **Authentication Components**
   - Login/Signup forms with React Hook Form
   - Protected route wrapper component
   - Authentication state management with Zustand

2. **Task Management Components**
   - TaskCard component for individual tasks
   - TaskForm for creating/editing tasks
   - TaskList for displaying and filtering tasks
   - Dashboard layout and navigation

### Step 6: Integration & Testing

1. **End-to-End Integration**
   - Connect frontend components to API routes
   - Implement real-time state updates
   - Add loading states and error handling

2. **Testing & Validation**
   - API endpoint testing
   - Component unit tests
   - Integration testing
   - Manual testing procedures

---

## 📚 Available Resources

- **Database**: Fully configured Neon PostgreSQL with schema
- **Environment**: Complete `.env.local` with database credentials
- **Documentation**: Comprehensive guides in `/docs` folder
- **Scripts**: Database utilities in `/scripts` folder
- **Project Structure**: Clean, organized codebase ready for development

**Ready to proceed with NextAuth.js implementation!** 🚀
"test:components": "jest tests/components",
"test:integration": "jest tests/integration",
"test:e2e": "playwright test"
}
}

````

**Continuous Testing Setup:**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
````
