'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getSettings() {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: 'default' }
        });

        if (!settings) {
            // Should be created by seed, but fallback just in case
            return { success: false, error: 'Settings not found' };
        }

        return { success: true, data: settings };
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return { success: false, error: 'Failed to fetch settings' };
    }
}

export async function updateSettings(data: {
    businessName?: string;
    contactEmail?: string;
    currency?: string;
    availability?: any; // JSON
    integrations?: any; // JSON
}) {
    try {
        const settings = await prisma.settings.update({
            where: { id: 'default' },
            data: {
                ...data
            }
        });

        revalidatePath('/dashboard/settings');
        return { success: true, data: settings };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
