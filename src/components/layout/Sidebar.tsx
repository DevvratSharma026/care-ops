'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Inbox,
    FileText,
    UserCog,
    Package,
    Settings,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useBusinessStore } from '@/lib/store';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarDays },
    { name: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
    { name: 'Forms', href: '/dashboard/forms', icon: FileText },
    { name: 'Staff', href: '/dashboard/staff', icon: UserCog },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, currentUser } = useBusinessStore();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="flex w-64 flex-col bg-white border-r border-gray-200">
            <div className="flex h-16 items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                        CO
                    </div>
                    CareOps
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 mt-4">
                    Menu
                </div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                isActive
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    'mr-3 h-5 w-5 flex-shrink-0',
                                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}

                <div className="mt-auto">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 mt-6">
                        Settings
                    </div>
                    <Link
                        href="/dashboard/settings"
                        className={clsx(
                            'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                            pathname === '/dashboard/settings'
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                    >
                        <Settings
                            className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                        />
                        Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors mt-1"
                    >
                        <LogOut
                            className="mr-3 h-5 w-5 flex-shrink-0 text-red-400 group-hover:text-red-500"
                            aria-hidden="true"
                        />
                        Sign out
                    </button>
                </div>
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                        JD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">John Doe</span>
                        <span className="text-xs text-gray-500">Business Owner</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
