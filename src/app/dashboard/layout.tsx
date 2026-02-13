import { getLeads } from '@/app/actions/leads';
import { getBookings } from '@/app/actions/bookings';
import { getStaff } from '@/app/actions/staff';
import { getServices } from '@/app/actions/services';
import { getSettings } from '@/app/actions/settings';
import { getInventory } from '@/app/actions/inventory';
import { getMessages } from '@/app/actions/messages';
import { getActivities } from '@/app/actions/activity';

import StoreInitializer from '@/components/StoreInitializer';
import ClientLayout from './ClientLayout';

import { getMe } from '@/app/actions/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
    // Parallel data fetching
    const [
        leadsRes,
        bookingsRes,
        staffRes,
        servicesRes,
        settingsRes,
        inventoryRes,
        messagesRes,
        activitiesRes,
        userRes
    ] = await Promise.all([
        getLeads(),
        getBookings(),
        getStaff(),
        getServices(),
        getSettings(),
        getInventory(),
        getMessages(),
        getActivities(),
        getMe()
    ]);

    return (
        <>
            <StoreInitializer
                leads={leadsRes.success ? leadsRes.data || [] : []}
                bookings={bookingsRes.success ? bookingsRes.data || [] : []}
                staff={staffRes.success ? staffRes.data || [] : []}
                services={servicesRes.success ? servicesRes.data || [] : []}
                settings={settingsRes.success ? settingsRes.data : null}
                inventory={inventoryRes.success ? inventoryRes.data || [] : []}
                messages={messagesRes.success ? messagesRes.data || [] : []}
                activityFeed={activitiesRes.success ? activitiesRes.data || [] : []}
                currentUser={userRes.success ? userRes.data : null}
            />
            <ClientLayout>{children}</ClientLayout>
        </>
    );
}
