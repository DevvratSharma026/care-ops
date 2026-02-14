'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getActivities() {
    try {
        const activities = await prisma.activityLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 50 // Limit to recent 50
        });
        return { success: true, data: activities };
    } catch (error) {
        console.error('Failed to fetch activities:', error);
        return { success: false, error: 'Failed to fetch activities' };
    }
}

export async function logActivity(data: {
    type: string;
    title: string;
    description?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any;
}) {
    try {
        await prisma.activityLog.create({
            data: {
                type: data.type,
                title: data.title,
                description: data.description,
                metadata: data.metadata || {},
            }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to log activity:', error);
        return { success: false, error: 'Failed to log activity' };
    }
}
