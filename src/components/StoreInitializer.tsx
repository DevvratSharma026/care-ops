'use client';

import { useRef } from 'react';
import { useBusinessStore } from '@/lib/store';

/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initData: any = {
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
    };
    useBusinessStore.setState(initData);
    return null;
}
