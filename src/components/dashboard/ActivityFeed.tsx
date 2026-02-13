'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Mail, CheckCircle, Activity } from 'lucide-react';
import { useBusinessStore } from '@/lib/store';
import { Lead, Booking, Message } from '@/types/domain';

export default function ActivityFeed() {
    const { activityFeed } = useBusinessStore();

    // Map store activities to UI format if needed, or use directly if shapes match
    // Store ActivityItem: { id, type, title, description, timestamp, metadata }
    // UI ActivityItem: { id, type, content, date, icon, color, bg }

    const activities = activityFeed.map((item) => {
        let icon = Activity;
        let color = 'text-gray-500';
        let bg = 'bg-gray-50';

        switch (item.type) {
            case 'lead':
                icon = User;
                color = 'text-green-500';
                bg = 'bg-green-50';
                break;
            case 'booking':
                icon = Calendar;
                color = 'text-blue-500';
                bg = 'bg-blue-50';
                break;
            case 'message':
                icon = Mail;
                color = 'text-purple-500';
                bg = 'bg-purple-50';
                break;
            case 'system':
                icon = CheckCircle;
                color = 'text-gray-500';
                bg = 'bg-gray-100';
                break;
        }

        return {
            id: item.id,
            type: item.type as ActivityItem['type'],
            content: `${item.title}: ${item.description}`,
            date: new Date(item.timestamp),
            icon,
            color,
            bg
        };
    });

    // Helper for relative time
    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return date.toLocaleDateString();
    };

    // Hydration fix: only render relative time client-side
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* ... */}
            <div className="p-6">
                <ul className="space-y-6">
                    {activities.length === 0 ? (
                        <li className="text-gray-500 text-sm">No recent activity</li>
                    ) : (
                        activities.map((activity) => (
                            <li key={activity.id} className="flex gap-4">
                                {/* ... */}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.content}</p>
                                    <p className="text-xs text-gray-500 mt-0.5" suppressHydrationWarning>
                                        {mounted ? getRelativeTime(activity.date) : activity.date.toLocaleDateString()}
                                    </p>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

interface ActivityItem {
    id: string;
    type: 'lead' | 'booking' | 'message' | 'system';
    content: string;
    date: Date;
    icon: React.ElementType; // Better than any
    color: string;
    bg: string;
}
