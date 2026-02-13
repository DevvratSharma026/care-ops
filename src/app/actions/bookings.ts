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
        return { success: true, data: bookings };
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
