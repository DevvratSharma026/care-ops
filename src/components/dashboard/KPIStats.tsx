'use client'
import { Users, CalendarDays, DollarSign, TrendingUp } from 'lucide-react';
import { useBusinessStore } from '@/lib/store';

export default function KPIStats() {
    const { dashboardMetrics } = useBusinessStore();

    const stats = [
        {
            name: 'Total Leads',
            value: dashboardMetrics.totalLeads.toString(),
            change: '+12.5%', // Placeholder as we don't store history yet
            changeType: 'positive',
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            name: 'Bookings',
            value: dashboardMetrics.totalBookings.toString(),
            change: '+4.3%',
            changeType: 'positive',
            icon: CalendarDays,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            name: 'Revenue',
            value: '$12,450', // Placeholder
            change: '+2.1%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            name: 'Conversion Rate',
            value: dashboardMetrics.conversionRate.toFixed(1) + '%',
            change: '-1.2%',
            changeType: 'negative',
            icon: TrendingUp,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.name}
                    className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 rounded-lg p-3 ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">
                                        {stat.name}
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stat.value}
                                        </div>
                                        <div
                                            className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                                }`}
                                        >
                                            {stat.change}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
