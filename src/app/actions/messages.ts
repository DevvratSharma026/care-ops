'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '../actions'; // SMTP action

export async function getMessages() {
    try {
        const messages = await prisma.message.findMany({
            include: { lead: true },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: messages };
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        return { success: false, error: 'Failed to fetch messages' };
    }
}

export async function sendMessage(data: {
    leadId: string;
    content: string;
    senderId: string;
}) {
    try {
        const message = await prisma.message.create({
            data: {
                lead: { connect: { id: data.leadId } },
                content: data.content,
                senderId: data.senderId,
            },
            include: { lead: true }
        });

        // If system message to lead, send email
        if (data.senderId === 'system' && message.lead.email) {
            // Simplified notification
            await sendEmail(
                message.lead.email,
                'New Message from CareOps',
                `<p>${data.content}</p>`
            );
        }

        revalidatePath('/dashboard/inbox');
        return { success: true, data: message };
    } catch (error) {
        console.error('Failed to send message:', error);
        return { success: false, error: 'Failed to send message' };
    }
}

export async function markMessageRead(id: string) {
    try {
        const message = await prisma.message.update({
            where: { id },
            data: { readAt: new Date() }
        });

        revalidatePath('/dashboard/inbox');
        return { success: true, data: message };
    } catch (error) {
        console.error('Failed to mark message read:', error);
        return { success: false, error: 'Failed to mark message read' };
    }
}
