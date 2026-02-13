'use client';

import { Bell, Search } from 'lucide-react';

export default function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Search leads, bookings..."
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
            </div>
        </header>
    );
}
