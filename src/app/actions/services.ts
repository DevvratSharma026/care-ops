'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getServices() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: 'asc' }
        });

        // Convert Decimal to number for client serialization
        const serializedServices = services.map(service => ({
            ...service,
            price: Number(service.price)
        }));

        return { success: true, data: serializedServices };
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return { success: false, error: 'Failed to fetch services' };
    }
}

export async function createService(data: {
    name: string;
    description?: string;
    duration: number;
    price: number;
}) {
    try {
        const service = await prisma.service.create({
            data: {
                name: data.name,
                description: data.description,
                duration: data.duration,
                price: data.price,
            }
        });

        // Convert Decimal to number for client serialization
        const serializedService = {
            ...service,
            price: Number(service.price)
        };

        revalidatePath('/dashboard/bookings'); // Services affect booking form
        return { success: true, data: serializedService };
    } catch (error) {
        console.error('Failed to create service:', error);
        return { success: false, error: 'Failed to create service' };
    }
}
