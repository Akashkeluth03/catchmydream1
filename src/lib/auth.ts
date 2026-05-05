import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await hashPassword(password);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'STUDENT',
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function verifyUserCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user || !user.password) return null;
  
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) return null;
  
  return user;
}
