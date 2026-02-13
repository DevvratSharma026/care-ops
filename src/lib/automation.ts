import { AutomationEventType, Lead, Booking, InventoryItem, AutomationEvent } from '@/types/domain';
import { eventBus } from './eventBus';
import { useBusinessStore } from './store';
import { sendEmail } from '@/app/actions';

// We need a way to access the store actions without hooks if possible, 
// or we initialize this within a component/hook. 
// However, Zustand store is accessible via getState() outside components.

export const initializeAutomation = () => {
    const store = useBusinessStore.getState();

    // Subscribe to events

    // 1. LEAD_CREATED
    eventBus.subscribe('LEAD_CREATED', (data: unknown) => {
        const payload = data as Lead;
        // Draft Welcome Message
        store.sendMessage(
            `Hi ${payload.name}, thanks for contacting us! We have received your inquiry and will be in touch shortly.`,
            payload.id,
            'system'
        );

        store.addActivity({
            type: 'lead',
            title: 'New Lead Acquired',
            description: `${payload.name} joined via ${payload.source}`,
            metadata: { leadId: payload.id }
        });

        // Send Welcome Email
        sendEmail(
            payload.email,
            'Welcome to CareOps!',
            `<p>Hi ${payload.name},</p><p>Thanks for getting in touch. We'll get back to you shortly.</p>`
        );
    });

    // 2. BOOKING_CONFIRMED
    eventBus.subscribe('BOOKING_CONFIRMED', (data: unknown) => {
        const payload = data as Booking;
        store.sendMessage(
            `Great news! Your booking for ${payload.date} at ${payload.time} is confirmed. Please fill out the intake form attached.`,
            payload.leadId,
            'system'
        );

        store.addActivity({
            type: 'booking',
            title: 'Booking Confirmed',
            description: `Booking confirmed for ${payload.date}`,
            metadata: { bookingId: payload.id }
        });

        // Dispatch Intake Form Event (simulated)
        eventBus.dispatch('INTAKE_FORM_SENT', { leadId: payload.leadId });
    });

    // 3. BOOKING_CREATED
    eventBus.subscribe('BOOKING_CREATED', (data: unknown) => {
        const payload = data as Booking;
        store.addActivity({
            type: 'booking',
            title: 'New Booking Request',
            description: `Request for ${payload.date} at ${payload.time}`,
            metadata: { bookingId: payload.id }
        });
    });

    // 4. INVENTORY_LOW
    eventBus.subscribe('INVENTORY_LOW', (data: unknown) => {
        const payload = data as InventoryItem;
        store.addActivity({
            type: 'system',
            title: 'Low Stock Alert',
            description: `Item ${payload.name} is running low (${payload.quantity} remaining).`,
            metadata: { itemId: payload.id }
        });
    });

    // 5. LEAD_STATUS_CHANGED
    eventBus.subscribe('LEAD_STATUS_CHANGED', (data: unknown) => {
        const payload = data as { id: string, status: string, name: string };
        store.addActivity({
            type: 'lead',
            title: 'Lead Status Updated',
            description: `${payload.name} moved to ${payload.status}`,
            metadata: { leadId: payload.id }
        });
    });

    // 6. MESSAGE_SENT
    eventBus.subscribe('MESSAGE_SENT', (data: unknown) => {
        const payload = data as { content: string, senderId: string };
        const settings = store.settings;

        if (payload.senderId !== 'system') {
            // Notify Admin
            sendEmail(
                settings.contactEmail,
                'New Message Received',
                `<p>You have a new message from a lead.</p><p><strong>${payload.content}</strong></p>`
            );
        }
    });
};

/* 
 * Deprecated synchronous processor - keeping for reference if needed during migration, 
 * but `initializeAutomation` replaces it.
 */
export const processAutomationRules = (_event: AutomationEvent) => { return []; };
export const generateAutomationEvent = (type: AutomationEventType, payload: Record<string, unknown>) => ({ id: '0', type, payload, createdAt: '', processed: true });
