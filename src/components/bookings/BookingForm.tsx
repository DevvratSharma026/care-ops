'use client';

import { useState } from 'react';
import { useBusinessStore } from '@/lib/store';

interface BookingFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function BookingForm({ onSuccess, onCancel }: BookingFormProps) {
    const { addBooking, leads } = useBusinessStore();
    const [formData, setFormData] = useState({
        leadId: '',
        serviceId: 's-1', // Default service for now
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 60,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.leadId) return alert('Please select a client');

        addBooking({
            leadId: formData.leadId,
            serviceId: formData.serviceId,
            date: formData.date,
            time: formData.time,
            duration: Number(formData.duration),
        });
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Client / Lead</label>
                <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
                    value={formData.leadId}
                    onChange={e => setFormData({ ...formData, leadId: e.target.value })}
                >
                    <option value="">Select a client...</option>
                    {leads.map(lead => (
                        <option key={lead.id} value={lead.id}>{lead.name} ({lead.company})</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                        type="time"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
                        value={formData.time}
                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                </select>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                    Create Booking
                </button>
            </div>
        </form>
    );
}
