'use server';

import { BookingStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                lead: true,
                service: true,
                staff: true,
            },
            orderBy: { date: 'asc' }
        });

        // Convert Decimal to number for client serialization
        const serializedBookings = bookings.map(booking => ({
            ...booking,
            service: booking.service ? {
                ...booking.service,
                price: Number(booking.service.price)
            } : null
        }));

        return { success: true, data: serializedBookings };
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return { success: false, error: 'Failed to fetch bookings' };
    }
}

export async function createBooking(data: {
    leadId: string;
    serviceId: string;
    date: Date;
    time: string;
    duration: number;
    staffId?: string;
    notes?: string;
}) {
    try {
        // Validate that the service exists
        const service = await prisma.service.findUnique({
            where: { id: data.serviceId }
        });

        if (!service) {
            console.error(`Service not found with ID: ${data.serviceId}`);
            return {
                success: false,
                error: `Service not found. Please select a valid service.`
            };
        }

        // Validate that the lead exists
        const lead = await prisma.lead.findUnique({
            where: { id: data.leadId }
        });

        if (!lead) {
            console.error(`Lead not found with ID: ${data.leadId}`);
            return {
                success: false,
                error: `Lead not found. Please select a valid lead.`
            };
        }

        const booking = await prisma.booking.create({
            data: {
                date: data.date,
                time: data.time,
                duration: data.duration,
                status: BookingStatus.PENDING,
                notes: data.notes,
                lead: { connect: { id: data.leadId } },
                service: { connect: { id: data.serviceId } },
                ...(data.staffId ? { staff: { connect: { id: data.staffId } } } : {}),
            }
        });

        revalidatePath('/dashboard/bookings');
        return { success: true, data: booking };
    } catch (error) {
        console.error('Failed to create booking:', error);
        return { success: false, error: 'Failed to create booking' };
    }
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
    try {
        const booking = await prisma.booking.update({
            where: { id },
            data: { status }
        });

        revalidatePath('/dashboard/bookings');
        return { success: true, data: booking };
    } catch (error) {
        console.error('Failed to update booking status:', error);
        return { success: false, error: 'Failed to update booking status' };
    }
}
