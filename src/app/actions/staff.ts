'use server';

import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getStaff() {
    try {
        const staff = await prisma.user.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: staff };
    } catch (error) {
        console.error('Failed to fetch staff:', error);
        return { success: false, error: 'Failed to fetch staff' };
    }
}

import { sendEmail } from '@/app/actions';

// Domain role type (lowercase)
type DomainUserRole = 'owner' | 'manager' | 'staff';

export async function createStaff(data: {
    name: string;
    email: string;
    role: DomainUserRole;
    avatarUrl?: string;
}) {
    try {
        // Map to Prisma Enum (uppercase)
        const prismaRole = data.role.toUpperCase() as UserRole;

        const staff = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                role: prismaRole,
                avatarUrl: data.avatarUrl,
            }
        });

        // Send Invite Email
        await sendEmail(
            data.email,
            'You have been invited to CareOps',
            `<p>Hi ${data.name},</p><p>You have been invited to join CareOps as a ${data.role}.</p>`
        );

        revalidatePath('/dashboard/staff');
        return { success: true, data: staff };
    } catch (error) {
        console.error('Failed to create staff:', error);
        return { success: false, error: 'Failed to create staff' };
    }
}

export async function updateStaffRole(id: string, role: DomainUserRole) {
    try {
        const prismaRole = role.toUpperCase() as UserRole;
        const staff = await prisma.user.update({
            where: { id },
            data: { role: prismaRole }
        });

        revalidatePath('/dashboard/staff');
        return { success: true, data: staff };
    } catch (error) {
        console.error('Failed to update staff role:', error);
        return { success: false, error: 'Failed to update staff role' };
    }
}

export async function deleteStaff(id: string) {
    try {
        await prisma.user.delete({
            where: { id }
        });

        revalidatePath('/dashboard/staff');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete staff:', error);
        return { success: false, error: 'Failed to delete staff' };
    }
}
