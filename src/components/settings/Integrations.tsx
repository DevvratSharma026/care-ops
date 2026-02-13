'use client';

import { useBusinessStore } from '@/lib/store';
import { Mail, MessageSquare, Calendar } from 'lucide-react';
import clsx from 'clsx';

// Mock integrations
const INTEGRATIONS = [
    { id: 'emailProvider', name: 'Email Provider', icon: Mail, description: 'Connect Gmail or Outlook for emails.' },
    { id: 'smsProvider', name: 'SMS Gateway', icon: MessageSquare, description: 'Connect Twilio for SMS notifications.' },
    { id: 'calendar', name: 'Calendar Sync', icon: Calendar, description: 'Sync bookings with Google Calendar.' },
] as const;

export default function Integrations() {
    const { settings, updateSettings } = useBusinessStore();

    const toggleIntegration = (id: keyof typeof settings.integrations) => {
        updateSettings({
            integrations: {
                ...settings.integrations,
                [id]: !settings.integrations[id]
            }
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
                <p className="text-sm text-gray-500">Connect your tools to automate workflows.</p>
            </div>

            <div className="divide-y divide-gray-100">
                {INTEGRATIONS.map(integration => {
                    const Icon = integration.icon;
                    const isConnected = settings.integrations[integration.id];

                    return (
                        <div key={integration.id} className="p-6 flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className={clsx("p-3 rounded-lg flex-none", isConnected ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500")}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{integration.name}</h3>
                                    <p className="text-sm text-gray-500">{integration.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleIntegration(integration.id)}
                                className={clsx(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                                    isConnected
                                        ? "bg-white text-red-600 border-red-200 hover:bg-red-50"
                                        : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                )}
                            >
                                {isConnected ? 'Disconnect' : 'Connect'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
