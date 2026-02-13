'use server';

import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// Mock authentication by getting the first user (usually admin)
// In real app, this would check session/cookies
export async function getMe() {
    try {
        const user = await prisma.user.findFirst({
            // orderBy: { createdAt: 'asc' } // Get oldest user (admin created first)
            where: { email: 'admin@careops.com' }
        });

        if (!user) {
            // Fallback to any user if admin not found (e.g. staff created first)
            const anyUser = await prisma.user.findFirst();
            if (anyUser) return { success: true, data: anyUser };
            return { success: false, error: 'No user found' };
        }

        return { success: true, data: user };
    } catch (error) {
        console.error('Failed to get current user:', error);
        return { success: false, error: 'Failed to get current user' };
    }
}
