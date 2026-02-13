'use client';

import { useState } from 'react';
import BookingList from '@/components/bookings/BookingList';
import CalendarView from '@/components/bookings/CalendarView';
import BookingForm from '@/components/bookings/BookingForm';
import Modal from '@/components/ui/Modal';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { useBusinessStore } from '@/lib/store';

export default function BookingsPage() {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
    const { bookings } = useBusinessStore();

    // Helper to get start of week (Sunday)
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };

    // Helper to get end of week (Saturday)
    const getEndOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + 6;
        return new Date(d.setDate(diff));
    };

    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = getEndOfWeek(currentDate);

    // Filter bookings for List View (Weekly)
    const weeklyBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        // Reset time parts for accurate comparison
        bookingDate.setHours(0, 0, 0, 0);
        const start = new Date(startOfWeek);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endOfWeek);
        end.setHours(23, 59, 59, 999);

        return bookingDate >= start && bookingDate <= end;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const formatDateRange = (start: Date, end: Date) => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your schedule and appointments.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {viewMode === 'list' && (
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                            <button onClick={handlePrevWeek} className="p-1 hover:bg-gray-100 rounded">
                                <ChevronLeft className="w-4 h-4 text-gray-500" />
                            </button>
                            <span className="px-3 text-sm font-medium text-gray-700 w-32 text-center">
                                {formatDateRange(startOfWeek, endOfWeek)}
                            </span>
                            <button onClick={handleNextWeek} className="p-1 hover:bg-gray-100 rounded">
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        {viewMode === 'list' ? <CalendarIcon className="h-4 w-4" /> : <List className="h-4 w-4" />}
                        {viewMode === 'list' ? 'Calendar View' : 'List View'}
                    </button>

                    <button
                        onClick={() => setIsNewBookingModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        New Booking
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <BookingList bookings={weeklyBookings} />
            ) : (
                <CalendarView
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    onSelectBooking={(id) => console.log('Selected', id)}
                />
            )}

            <Modal
                isOpen={isNewBookingModalOpen}
                onClose={() => setIsNewBookingModalOpen(false)}
                title="New Booking"
            >
                <BookingForm
                    onSuccess={() => setIsNewBookingModalOpen(false)}
                    onCancel={() => setIsNewBookingModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
