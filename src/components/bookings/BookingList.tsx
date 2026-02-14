'use client';

import { Calendar, Clock, Video, MapPin, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';
import StatusBadge, { StatusType } from '../ui/StatusBadge';
import { useBusinessStore } from '@/lib/store';
import { Booking } from '@/types/domain';

interface BookingListProps {
    bookings?: Booking[];
}

export default function BookingList({ bookings: propBookings }: BookingListProps) {
    const { bookings: storeBookings, leads, updateBookingStatus } = useBusinessStore();

    // Use prop bookings if available, otherwise use store bookings
    const bookings = propBookings || storeBookings;

    // Helper to get client name (lead name)
    const getClientName = (leadId: string) => {
        return leads.find(l => l.id === leadId)?.name || 'Unknown Client';
    };

    const getClientAvatar = (leadId: string) => {
        const name = getClientName(leadId);
        return name.charAt(0);
    };

    // Helper for date formatting
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {bookings.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    No bookings found.
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-4">
                            {/* Time Column */}
                            <div className="flex flex-row sm:flex-col items-center sm:items-start sm:w-32 gap-3 sm:gap-1">
                                <div className="text-lg font-semibold text-gray-900">
                                    {formatDate(booking.date)}
                                </div>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mt-1 sm:hidden">
                                    {booking.time}
                                </div>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm">
                                            {getClientAvatar(booking.leadId)}
                                        </div>
                                        <h4 className="text-base font-medium text-gray-900 truncate">
                                            {getClientName(booking.leadId)}
                                        </h4>
                                        <StatusBadge status={booking.status as StatusType} />
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 sm:hidden">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-sm font-medium text-gray-900 mb-2">Service Booking</p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div className="hidden sm:flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {booking.time} ({booking.duration} min)
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        In-person
                                    </div>
                                </div>
                            </div>

                            {/* Actions Column */}
                            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-100">
                                {booking.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip"
                                            title="Confirm"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg tooltip"
                                            title="Decline"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-center">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all bookings</button>
            </div>
        </div>
    );
}
