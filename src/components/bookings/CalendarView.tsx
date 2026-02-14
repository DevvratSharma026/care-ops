'use client';

import { Booking } from '@/types/domain';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useBusinessStore } from '@/lib/store';

interface CalendarViewProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onSelectBooking: (bookingId: string) => void;
}

export default function CalendarView({ currentDate, onDateChange, onSelectBooking }: CalendarViewProps) {
    const { bookings, leads } = useBusinessStore();

    // Helper to get days in month
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    // Helper to get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        onDateChange(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        onDateChange(new Date(year, month + 1, 1));
    };

    const getBookingsForDay = (day: number) => {
        const dateStr = new Date(year, month, day).toISOString().slice(0, 10); // YYYY-MM-DD (local approximation)
        // Careful with timezone here. For simplicity in this prototype, we match string dates.
        // Ideally we'd use a library like date-fns or dayjs.
        // Let's manually construct the local YYYY-MM-DD
        const d = new Date(year, month, day);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        const formatted = `${y}-${m}-${da}`;

        return bookings.filter(b => b.date === formatted);
    };

    const getClientName = (leadId: string) => {
        return leads.find(l => l.id === leadId)?.name.split(' ')[0] || 'Client';
    };

    // Generate grid cells
    const days = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="bg-gray-50 h-24 border-b border-r border-gray-100"></div>);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayBookings = getBookingsForDay(i);
        const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();

        days.push(
            <div key={`day-${i}`} className={clsx("h-24 border-b border-r border-gray-100 p-1 transition-colors hover:bg-gray-50", isToday && "bg-indigo-50")}>
                <div className="flex justify-between items-start">
                    <span className={clsx("text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full", isToday ? "bg-indigo-600 text-white" : "text-gray-700")}>
                        {i}
                    </span>
                </div>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                    {dayBookings.map(booking => (
                        <div
                            key={booking.id}
                            onClick={() => onSelectBooking(booking.id)}
                            className={clsx(
                                "text-xs px-1.5 py-0.5 rounded truncate cursor-pointer",
                                booking.status === 'CONFIRMED' ? "bg-green-100 text-green-800" :
                                    booking.status === 'CANCELLED' ? "bg-red-100 text-red-800" :
                                        "bg-indigo-100 text-indigo-800"
                            )}
                            title={`${booking.time} - ${getClientName(booking.leadId)}`}
                        >
                            {booking.time} {getClientName(booking.leadId)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                    {monthNames[month]} {year}
                </h2>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 bg-white">
                {days}
            </div>
        </div>
    );
}
