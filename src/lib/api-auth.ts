import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Extend the session type to include user ID
interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Authentication result type
interface AuthResult {
  success: true;
  userId: number;
  session: ExtendedSession;
}

interface AuthError {
  success: false;
  response: NextResponse;
}

/**
 * Authentication middleware utility for API routes
 * Returns userId if authenticated, or an error response if not
 */
export async function authenticateUser(): Promise<AuthResult | AuthError> {
  try {
    const session = (await getServerSession(
      authOptions
    )) as ExtendedSession | null;

    if (!session?.user?.id) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error:
              'Authentication required. Please sign in to access this resource.',
          },
          { status: 401 }
        ),
      };
    }

    const userId = parseInt(session.user.id);

    if (isNaN(userId)) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Invalid user session. Please sign in again.' },
          { status: 401 }
        ),
      };
    }

    return {
      success: true,
      userId,
      session,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Authentication service unavailable. Please try again later.',
        },
        { status: 503 }
      ),
    };
  }
}

/**
 * Validates and parses task ID from route parameters
 */
export function validateTaskId(
  idParam: string
):
  | { success: true; taskId: number }
  | { success: false; response: NextResponse } {
  const taskId = parseInt(idParam);

  if (isNaN(taskId) || taskId <= 0) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid task ID. Task ID must be a positive number.' },
        { status: 400 }
      ),
    };
  }

  return {
    success: true,
    taskId,
  };
}

/**
 * Validates and parses JSON from request body
 */
export async function validateRequestBody(
  request: NextRequest
): Promise<
  { success: true; body: any } | { success: false; response: NextResponse }
> {
  try {
    const body = await request.json();
    return {
      success: true,
      body,
    };
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        {
          error:
            'Invalid JSON in request body. Please check your request format.',
        },
        { status: 400 }
      ),
    };
  }
}

/**
 * Standard error response for database or server errors
 */
export function createServerErrorResponse(
  operation: string,
  error: unknown
): NextResponse {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Error ${operation}:`, error);

  return NextResponse.json(
    {
      error: `Failed to ${operation}. Please try again later.`,
      details:
        process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    },
    { status: 500 }
  );
}

/**
 * Standard success response format
 */
export function createSuccessResponse(
  data: any,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      data,
    },
    { status }
  );
}
