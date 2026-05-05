import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
}

export async function createSession(user: { id: string; email: string | null; name: string | null; role: string }): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) return null;

    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete('session');
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === 'ADMIN';
}
