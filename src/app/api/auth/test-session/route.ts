import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../[...nextauth]/route';

// GET /api/auth/test-session - Test endpoint to check authentication status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
          message: 'No active session found',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: (session.user as any)?.id,
        email: session.user?.email,
        name: session.user?.name,
      },
      message: 'Authentication successful',
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Failed to check session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/auth/test-login - Test endpoint for API authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // This endpoint is for testing only - in a real app, you'd use NextAuth.js flows
    // For API testing, we'll just verify credentials and return user info
    const { sql } = await import('@vercel/postgres');
    const bcrypt = await import('bcryptjs');

    try {
      // Find user in database
      const result = await sql`
        SELECT id, name, email, password_hash 
        FROM users 
        WHERE email = ${email}
      `;

      const user = result.rows[0];

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid credentials',
          },
          { status: 401 }
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid credentials',
          },
          { status: 401 }
        );
      }

      // Return user info (for testing purposes)
      return NextResponse.json({
        success: true,
        message: 'Credentials verified successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        note: 'This endpoint is for API testing only. For actual authentication, use the web interface at /auth/signin',
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication service unavailable',
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request format',
      },
      { status: 400 }
    );
  }
}
