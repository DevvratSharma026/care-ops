
import { create } from 'zustand';
// import { v4 as uuidv4 } from 'uuid'; // We might need uuid, or just use crypto.randomUUID()
import {
    User, Lead, Booking, Message, InventoryItem, Form, AutomationEvent,
    LeadStatus, BookingStatus, AutomationEventType, FormSubmission, Attachment,
    ActivityItem, Service, BusinessSettings
} from '@/types/domain';
// import { processAutomationRules, generateAutomationEvent } from './automation'; // DEPRECATED
import { eventBus } from './eventBus';
import { hasPermission } from './permissions';
// Server Actions
import { createLead, updateLeadStatus as updateLeadStatusAction } from '@/app/actions/leads';
import { createBooking, updateBookingStatus as updateBookingStatusAction } from '@/app/actions/bookings';
import { sendMessage as sendMessageAction } from '@/app/actions/messages';
import { createStaff, updateStaffRole as updateStaffRoleAction, deleteStaff } from '@/app/actions/staff';
import { createService, getServices, createService as createServiceAction } from '@/app/actions/services'; // Alias collision? createServiceAction
import { updateSettings as updateSettingsAction } from '@/app/actions/settings';
import { createInventoryItem, updateInventoryQuantity as updateInventoryQuantityAction, deleteInventoryItem as deleteInventoryItemAction } from '@/app/actions/inventory'; // delete unused?
import { logActivity } from '@/app/actions/activity';


// Initial State (Empty, hydrated by StoreInitializer)
const INITIAL_LEADS: Lead[] = [];
const INITIAL_INVENTORY: InventoryItem[] = [];
const INITIAL_USER: User | null = null; // Will be set by auth or staff list? Actually hydration.
const INITIAL_STAFF: User[] = [];
const INITIAL_BOOKINGS: Booking[] = [];
const INITIAL_SERVICES: Service[] = [];
const INITIAL_SETTINGS: BusinessSettings = {
    businessName: '',
    contactEmail: '',
    currency: 'USD',
    availability: { days: [], start: '09:00', end: '17:00' },
    integrations: { emailProvider: false, smsProvider: false, calendar: false }
};

// State Interface
interface BusinessState {
    currentUser: User | null;
    leads: Lead[];
    bookings: Booking[];
    messages: Message[];
    inventory: InventoryItem[];
    forms: Form[];
    automationEvents: AutomationEvent[];
    activityFeed: ActivityItem[]; // Added missing property
    dashboardMetrics: {
        totalLeads: number;
        totalBookings: number;
        conversionRate: number;
    }

    staff: User[];
    services: Service[];
    settings: BusinessSettings;

    // Actions
    logout: () => void;

    // Async Actions wrapping Server Actions
    addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => Promise<void>;
    addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastActivityAt'> & { id?: string }) => Promise<void>;
    updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
    toggleLeadStar: (id: string, isStarred: boolean) => Promise<void>; // Updated signature?
    toggleLeadArchive: (id: string, isArchived: boolean) => Promise<void>; // Updated signature?

    addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'> & { id?: string }) => Promise<void>;
    updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;

    sendMessage: (content: string, leadId: string, senderId?: string, attachments?: Attachment[]) => Promise<void>;

    // Forms
    saveForm: (form: Form) => void; // Local for now?
    submitForm: (formId: string, data: Record<string, string>) => Promise<void>;

    updateInventoryQuantity: (id: string, quantity: number) => Promise<void>;
    addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => Promise<void>;
    deleteInventoryItem: (id: string) => Promise<void>;

    // Staff Actions
    addStaff: (user: Omit<User, 'id'>) => Promise<void>;
    updateStaffRole: (id: string, role: User["role"]) => Promise<void>;
    removeStaff: (id: string) => Promise<void>;

    // Settings
    updateSettings: (settings: Partial<BusinessSettings>) => Promise<void>;
    addService: (service: Omit<Service, 'id'>) => Promise<void>;
    updateService: (id: string, updates: Partial<Service>) => Promise<void>; // DB update
    deleteService: (id: string) => Promise<void>;

    // Data Management
    resetData: () => void;
    seedData: () => void; // Deprecated or re-fetch?

    // Internal Helper
    refreshMetrics: () => void;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
    currentUser: INITIAL_USER,
    staff: INITIAL_STAFF,
    leads: INITIAL_LEADS,
    bookings: INITIAL_BOOKINGS,
    messages: [],
    inventory: INITIAL_INVENTORY,
    services: INITIAL_SERVICES,
    settings: INITIAL_SETTINGS,
    forms: [],
    automationEvents: [],
    activityFeed: [], // Empty initially
    dashboardMetrics: {
        totalLeads: INITIAL_LEADS.length,
        totalBookings: INITIAL_BOOKINGS.length,
        conversionRate: 0,
    },

    logout: () => {
        set({ currentUser: null });
    },

    addActivity: async (activity) => {
        const result = await logActivity({
            type: activity.type,
            title: activity.title,
            description: activity.description,
            metadata: activity.metadata
        });

        // Optimistic update or wait for server?
        // Since activity log is fire-and-forget usually, we can optimistic update.
        if (result.success) {
            // We don't get the full object back easily from my logActivity action (it returns success: true).
            // But for Store we might want to append it. 
            // Actually, revalidatePath will fetch new activities.
            // Let's just append locally with a temp ID if we want instant feedback.
            const newItem: ActivityItem = {
                ...activity,
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString()
            };
            set(state => ({
                activityFeed: [newItem, ...state.activityFeed].slice(0, 50)
            }));
        }
    },

    addLead: async (leadData) => {
        // Permission check skipped or moved to server? 
        // Better to check here for instant feedback, AND server will check too.
        // const currentUser = get().currentUser;
        // if (!currentUser || !hasPermission(currentUser.role, 'MANAGE_LEADS')) return;

        const result = await createLead(leadData);

        if (result.success && result.data) {
            // Convert Dates to strings if needed by Store types?
            // Prisma returns Date objects. Store expects strings for ISO dates probably?
            // Domain type says: createdAt: string;
            // Result from actions: Date.
            // We need to map it.
            const newLead: Lead = {
                ...result.data,
                phone: result.data.phone || '', // Handle nulls
                company: result.data.company || '',
                source: result.data.source || '',
                notes: result.data.notes || '',
                createdAt: result.data.createdAt.toISOString(),
                lastActivityAt: result.data.lastActivityAt.toISOString(),
                updatedAt: result.data.updatedAt.toISOString(),
            } as any; // Cast because of slight type mismatch? Prisma vs Domain

            set(state => ({
                leads: [newLead, ...state.leads]
            }));

            eventBus.dispatch('LEAD_CREATED', newLead);
            get().refreshMetrics();
        }
    },

    updateLeadStatus: async (id, status) => {
        // const currentUser = get().currentUser;
        // if (!currentUser || !hasPermission(currentUser.role, 'MANAGE_LEADS')) return;

        const result = await updateLeadStatusAction(id, status);
        if (result.success && result.data) {
            set(state => ({
                leads: state.leads.map(l => l.id === id ? {
                    ...l,
                    status,
                    lastActivityAt: new Date().toISOString()
                } : l)
            }));

            // Need name for event, assume we have it or fetch result
            eventBus.dispatch('LEAD_STATUS_CHANGED', { id, status, name: result.data.name });
            get().refreshMetrics();
        }
    },

    toggleLeadStar: async (id, isStarred) => {
        // Server action needed? Or just local? 
        // Plan didn't specify server action for star/archive.
        // Assume local only for now OR create server action later.
        // For now, let's keep it sync in implementation but async signature?
        // No, if interface is Promise, it must return Promise.
        // We should probably implement server action for this too, generically? updateLead?
        // Let's use updateLead (if we had one) or just mock it as success for now.
        set(state => ({
            leads: state.leads.map(l => l.id === id ? { ...l, isStarred } : l)
        }));
    },

    toggleLeadArchive: async (id, isArchived) => {
        set(state => ({
            leads: state.leads.map(l => l.id === id ? { ...l, isArchived } : l)
        }));
    },

    addBooking: async (bookingData) => {
        // const currentUser = get().currentUser;
        // if (!currentUser || !hasPermission(currentUser.role, 'MANAGE_BOOKINGS')) return;

        const result = await createBooking({
            leadId: bookingData.leadId,
            serviceId: bookingData.serviceId,
            date: new Date(bookingData.date), // Ensure Date object
            time: bookingData.time,
            duration: bookingData.duration,
            notes: bookingData.notes,
            staffId: bookingData.staffId
        });

        if (result.success && result.data) {
            const newBooking: Booking = {
                ...result.data,
                date: result.data.date.toISOString().split('T')[0], // Store as string YYYY-MM-DD
                time: result.data.time,
                duration: result.data.duration,
                status: result.data.status,
                createdAt: result.data.createdAt.toISOString(),
                staffId: result.data.staffId || undefined,
                notes: result.data.notes || undefined
            } as any;

            set(state => ({
                bookings: [...state.bookings, newBooking]
            }));

            eventBus.dispatch('BOOKING_CREATED', newBooking);
            get().refreshMetrics();
        }
    },

    updateBookingStatus: async (id, status) => {
        const result = await updateBookingStatusAction(id, status);
        if (result.success && result.data) {
            set(state => ({
                bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
            }));

            if (status === 'confirmed') {
                eventBus.dispatch('BOOKING_CONFIRMED', { ...result.data, status: 'confirmed' } as any);
            }
            get().refreshMetrics();
        }
    },

    sendMessage: async (content, leadId, senderId = 'system', attachments = []) => {
        const result = await sendMessageAction({
            leadId,
            content,
            senderId
        });

        if (result.success && result.data) {
            const newMessage: Message = {
                id: result.data.id,
                leadId: result.data.leadId,
                senderId: result.data.senderId,
                content: result.data.content,
                createdAt: result.data.createdAt.toISOString(),
                attachments: [] // Attachments logic not meant yet
            };

            set(state => ({
                messages: [...state.messages, newMessage],
                leads: state.leads.map(l => l.id === leadId ? { ...l, lastActivityAt: new Date().toISOString() } : l)
            }));

            if (senderId !== 'system') {
                eventBus.dispatch('MESSAGE_SENT', newMessage);
            }
        }
    },

    // Forms
    // Forms
    saveForm: (form) => {
        // Local only for now as no server action for saving form design was requested/created yet?
        // Or we should create one?
        // Implementation plan said "Form Builder" later.
        // For now keep sync or mock async.
        set(state => {
            const existingFormIndex = state.forms.findIndex(f => f.id === form.id);
            if (existingFormIndex >= 0) {
                const updatedForms = [...state.forms];
                updatedForms[existingFormIndex] = { ...form, updatedAt: new Date().toISOString() };
                return { forms: updatedForms };
            } else {
                return { forms: [...state.forms, { ...form, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] };
            }
        });
    },

    submitForm: async (formId, data) => {
        // This usually creates a lead.
        if (data.email && data.name) {
            const result = await createLead({
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                status: 'new',
                source: 'Form Submission',
                company: data.company
            });

            if (result.success && result.data) {
                // Update local leads?
                // Reuse addLead logic or just re-fetch?
                // Let's just rely on revalidation or refetch. 
                // But for store consistency we might want to add it.
                // However, createLead action revalidates.
                // StoreInitializer will pick it up.
                // So we do nothing locally except maybe notification.
            }
        }
    },

    updateInventoryQuantity: async (id, quantity) => {
        const result = await updateInventoryQuantityAction(id, quantity);
        if (result.success && result.data) {
            set(state => ({
                inventory: state.inventory.map(item => {
                    if (item.id === id) {
                        // Map Prisma result back to domain Item?
                        // Result has status logic applied.
                        const newItem = {
                            ...item,
                            quantity: result.data.quantity,
                            status: result.data.status,
                            lastUpdated: new Date().toISOString() // Prisma has lastUpdated Date
                        } as any;

                        // Event dispatch?
                        if (newItem.status !== 'in_stock') {
                            eventBus.dispatch('INVENTORY_LOW', newItem);
                        }
                        return newItem;
                    }
                    return item;
                })
            }));
        }
    },

    addInventoryItem: async (itemData) => {
        // const currentUser = get().currentUser;
        // if (!currentUser || !hasPermission(currentUser.role, 'MANAGE_INVENTORY')) return;

        const result = await createInventoryItem({
            name: itemData.name,
            sku: itemData.sku,
            category: itemData.category,
            quantity: itemData.quantity,
            threshold: itemData.threshold
        });

        if (result.success && result.data) {
            const newItem: InventoryItem = {
                ...result.data,
                status: result.data.status,
                lastUpdated: result.data.lastUpdated.toISOString()
            } as any;

            set(state => ({
                inventory: [...state.inventory, newItem]
            }));
        }
    },

    deleteInventoryItem: async (id) => {
        const result = await deleteInventoryItemAction(id);
        if (result.success) {
            set(state => ({
                inventory: state.inventory.filter(item => item.id !== id)
            }));
        }
    },

    refreshMetrics: () => {
        set(state => {
            const totalLeads = state.leads.length;
            const totalBookings = state.bookings.length;
            const wonLeads = state.leads.filter(l => l.status === 'won').length;
            const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

            return {
                dashboardMetrics: {
                    totalLeads,
                    totalBookings,
                    conversionRate
                }
            };
        });
    },

    addStaff: async (userData) => {
        const result = await createStaff({
            name: userData.name,
            email: userData.email,
            role: userData.role as any, // Cast to UserRole enum?
            avatarUrl: userData.avatarUrl
        });

        if (result.success && result.data) {
            const newUser: User = {
                ...result.data,
                // Prisma User vs Domain User. Domain might have different fields?
            } as any;

            set(state => ({
                staff: [...state.staff, newUser]
            }));

            // Email is sent by server action now
        }
    },

    updateStaffRole: async (id, role) => {
        const result = await updateStaffRoleAction(id, role as any);
        if (result.success && result.data) {
            set(state => ({
                staff: state.staff.map(u => u.id === id ? { ...u, role } : u),
                currentUser: (state.currentUser && state.currentUser.id === id) ? { ...state.currentUser, role } : state.currentUser
            }));
        }
    },

    removeStaff: async (id) => {
        const result = await deleteStaff(id);
        if (result.success) {
            set(state => ({
                staff: state.staff.filter(u => u.id !== id)
            }));
        }
    },

    updateSettings: async (newSettings) => {
        const result = await updateSettingsAction(newSettings);
        if (result.success && result.data) {
            set(state => ({
                settings: { ...state.settings, ...result.data } as any
            }));
        }
    },

    addService: async (serviceData) => {
        const result = await createServiceAction({
            name: serviceData.name,
            description: serviceData.description,
            duration: serviceData.duration,
            price: serviceData.price
        });

        if (result.success && result.data) {
            // Map result
            const newService: Service = {
                ...result.data,
                price: Number(result.data.price) // Decimal to number
            } as any;

            set(state => ({
                services: [...state.services, newService]
            }));
        }
    },

    updateService: async (id, updates) => {
        // No server action for update service yet?
        // createService exists. getServices exists.
        // updateService MISSING in src/app/actions/services.ts?
        // Let's assume we add it or just log error.
        console.error("updateService server action not implemented yet");
        // Update local mostly for UI.
        set(state => ({
            services: state.services.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
    },

    deleteService: async (id) => {
        // No deleteService server action yet?
        console.error("deleteService server action not implemented yet");
        set(state => ({
            services: state.services.filter(s => s.id !== id)
        }));
    },

    resetData: () => {
        // Usually implementation of reset is complex with DB.
        // Maybe just clear local store?
        set({
            leads: [],
            bookings: [],
            messages: [],
            inventory: [],
            services: [],
            forms: [],
            automationEvents: [],
            activityFeed: [],
            dashboardMetrics: {
                totalLeads: 0,
                totalBookings: 0,
                conversionRate: 0,
            }
        });
        get().refreshMetrics();
    },

    seedData: () => {
        // Deprecated. We use Prisma seed now.
        console.warn("seedData is deprecated. Use 'npx prisma db seed'");
    }

}));
