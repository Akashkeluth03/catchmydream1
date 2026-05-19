import { NextRequest, NextResponse } from 'next/server';
import { verifyUserCredentials } from '@/lib/auth';
import { createSession } from '@/lib/session';

/**
 * Handle Credentials Login (POST)
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Verify credentials
    const user = await verifyUserCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    await createSession(user);

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle GitHub OAuth (GET)
 * If no code: Redirect to GitHub
 * If code: Handle callback
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  // Stage 1: Redirect to GitHub if no code provided
  if (!code) {
    const githubAuthUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${process.env.AUTH_GITHUB_ID}` +
      `&scope=user:email`;

    return NextResponse.redirect(githubAuthUrl);
  }

  // Stage 2: Handle GitHub Callback (exchange code for token)
  try {
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.AUTH_GITHUB_ID,
          client_secret: process.env.AUTH_GITHUB_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain access token' }, { status: 400 });
    }

    // Fetch GitHub user data
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = await userResponse.json();
    
    // Note: In a real app, you would now:
    // 1. Check if user exists in DB by github ID or email
    // 2. Create/Update user
    // 3. Create a session (e.g., using createSession)
    
    console.log('GitHub User authenticated:', githubUser.login);

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.json({ error: 'GitHub authentication failed' }, { status: 500 });
  }
}
