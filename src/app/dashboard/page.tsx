import KPIStats from '@/components/dashboard/KPIStats';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Overview of your business performance
                </p>
            </div>

            <KPIStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityFeed />
                <QuickActions />
            </div>
        </div>
    );
}
