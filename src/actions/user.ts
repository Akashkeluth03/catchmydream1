'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveUniversity(universityId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be logged in to save universities.' };
  }

  try {
    await prisma.savedItem.create({
      data: {
        userId: session.user.id,
        type: 'UNIVERSITY',
        entityId: universityId,
      },
    });
    revalidatePath('/dashboard');
    revalidatePath('/search');
    return { success: true };
  } catch {
    // Likely a unique constraint violation (already saved)
    return { error: 'Already saved.' };
  }
}

export async function removeSavedUniversity(universityId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated.' };
  }

  await prisma.savedItem.deleteMany({
    where: {
      userId: session.user.id,
      type: 'UNIVERSITY',
      entityId: universityId,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/search');
  return { success: true };
}

export async function getSavedUniversityIds(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const saved = await prisma.savedItem.findMany({
    where: { userId: session.user.id, type: 'UNIVERSITY' },
    select: { entityId: true },
  });

  return saved.map((s) => s.entityId);
}

export async function getSavedUniversities() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const saved = await prisma.savedItem.findMany({
    where: { userId: session.user.id, type: 'UNIVERSITY' },
    orderBy: { createdAt: 'desc' },
    select: { entityId: true, createdAt: true },
  });

  if (saved.length === 0) return [];

  const ids = saved.map((s) => s.entityId);
  const universities = await prisma.university.findMany({
    where: { id: { in: ids } },
    include: {
      country: { select: { name: true, slug: true } },
      courses: { select: { tuitionFeeUsd: true }, take: 1 },
    },
  });

  return universities;
}

export async function getApplications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getChecklist() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.checklistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { type: 'asc' },
  });
}

export async function toggleChecklistItem(type: string, done: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated.' };

  await prisma.checklistItem.upsert({
    where: { userId_type: { userId: session.user.id, type: type as never } },
    update: { done },
    create: {
      userId: session.user.id,
      type: type as never,
      done,
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}
