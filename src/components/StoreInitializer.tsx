'use client';

import { useRef } from 'react';
import { useBusinessStore } from '@/lib/store';

export default function StoreInitializer({
    leads,
    bookings,
    staff,
    services,
    settings,
    inventory,
    messages,
    activityFeed,
    currentUser
}: {
    leads: any[];
    bookings: any[];
    staff: any[];
    services: any[];
    settings: any;
    inventory: any[];
    messages: any[];
    activityFeed: any[];
    currentUser: any;
}) {
    useBusinessStore.setState({
        leads,
        bookings,
        staff,
        services,
        // settings might be null, store expects object?
        // We'll handle that in store or here.
        ...(settings ? { settings } : {}),
        inventory,
        messages,
        activityFeed,
        currentUser
    });
    return null;
}
