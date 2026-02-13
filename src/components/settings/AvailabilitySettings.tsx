'use client';

import { useBusinessStore } from '@/lib/store';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import clsx from 'clsx';
import { Availability } from '@/types/domain';

export default function AvailabilitySettings() {
    const { settings, updateSettings } = useBusinessStore();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const toggleDay = (day: string) => {
        const currentDays = settings.availability.days;
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];

        updateSettings({
            availability: { ...settings.availability, days: newDays }
        });
    };

    const updateTime = (key: 'start' | 'end', value: string) => {
        updateSettings({
            availability: { ...settings.availability, [key]: value }
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
                <p className="text-sm text-gray-500">Set your business hours and working days.</p>
            </div>

            <div className="p-6 space-y-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-indigo-500" />
                        Working Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {days.map(day => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={clsx(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                                    settings.availability.days.includes(day)
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" // Fixed blue color
                                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                                )}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        Business Hours
                    </label>
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                        <div>
                            <span className="text-xs text-gray-500 mb-1 block">Start Time</span>
                            <input
                                type="time"
                                value={settings.availability.start}
                                onChange={e => updateTime('start', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 mb-1 block">End Time</span>
                            <input
                                type="time"
                                value={settings.availability.end}
                                onChange={e => updateTime('end', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
