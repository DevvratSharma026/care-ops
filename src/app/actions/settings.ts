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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    availability?: any; // JSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    integrations?: any; // JSON
}) {
    try {
        const settings = await prisma.settings.upsert({
            where: { id: 'default' },
            update: {
                ...data
            },
            create: {
                id: 'default',
                businessName: data.businessName || 'CareOps',
                contactEmail: data.contactEmail || 'contact@example.com',
                currency: data.currency || 'USD',
                availability: data.availability || {
                    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    start: '09:00',
                    end: '17:00'
                },
                integrations: data.integrations || {
                    emailProvider: false,
                    smsProvider: false,
                    calendar: false
                }
            }
        });

        revalidatePath('/dashboard/settings');
        return { success: true, data: settings };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
