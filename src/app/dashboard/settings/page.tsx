'use client';

import { useState } from 'react';
import ServiceList from '@/components/settings/ServiceList';
import AvailabilitySettings from '@/components/settings/AvailabilitySettings';
import Integrations from '@/components/settings/Integrations';
import clsx from 'clsx';
import { Settings, Clock, Link2, Database } from 'lucide-react';
import { useBusinessStore } from '@/lib/store';

type Tab = 'general' | 'services' | 'availability' | 'integrations' | 'data';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'services', label: 'Services', icon: Clock }, // Reusing Clock for services
        { id: 'availability', label: 'Availability', icon: Clock },
        { id: 'integrations', label: 'Integrations', icon: Link2 },
        { id: 'data', label: 'Data', icon: Database },
    ] as const;

    const { resetData, seedData } = useBusinessStore();

    const handleReset = () => {
        if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
            resetData();
            alert('Data reset successfully.');
        }
    };

    const handleSeed = () => {
        if (confirm('This will overwrite existing data with demo data. Continue?')) {
            seedData();
            alert('Demo data seeded successfully.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500">Manage your business configuration.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-64 flex-none">
                    <nav className="space-y-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                        activeTab === tab.id
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'general' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                Basic business information. (Mock for now)
                            </p>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                    <input
                                        type="text"
                                        defaultValue="TopTier Service Co."
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        defaultValue="contact@toptier.com"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'services' && <ServiceList />}

                    {activeTab === 'availability' && <AvailabilitySettings />}

                    {activeTab === 'integrations' && <Integrations />}

                    {activeTab === 'data' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                Manage your application data. Use these options with caution.
                            </p>

                            <div className="space-y-6">
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <h3 className="text-sm font-medium text-yellow-800 mb-2">Demo Data</h3>
                                    <p className="text-sm text-yellow-700 mb-4">
                                        Populate the application with sample leads, bookings, and inventory items to test functionality.
                                    </p>
                                    <button
                                        onClick={handleSeed}
                                        className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors"
                                    >
                                        Seed Demo Data
                                    </button>
                                </div>

                                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                    <h3 className="text-sm font-medium text-red-800 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-red-700 mb-4">
                                        Permanently delete all data including leads, bookings, inventory, and staff accounts.
                                    </p>
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                    >
                                        Reset All Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
