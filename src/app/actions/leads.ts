'use server';

import { LeadStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getLeads() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: leads };
    } catch (error) {
        console.error('Failed to fetch leads:', error);
        return { success: false, error: 'Failed to fetch leads' };
    }
}

export async function createLead(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    source?: string;
    status?: LeadStatus;
}) {
    try {
        const lead = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                company: data.company,
                source: data.source || 'Manual',
                status: data.status || LeadStatus.NEW,
                lastActivityAt: new Date(),
            }
        });

        revalidatePath('/dashboard/leads');
        return { success: true, data: lead };
    } catch (error) {
        console.error('Failed to create lead:', error);
        return { success: false, error: 'Failed to create lead' };
    }
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
    try {
        const lead = await prisma.lead.update({
            where: { id },
            data: {
                status,
                lastActivityAt: new Date()
            }
        });

        revalidatePath('/dashboard/leads');
        return { success: true, data: lead };
    } catch (error) {
        console.error('Failed to update lead status:', error);
        return { success: false, error: 'Failed to update lead status' };
    }
}
