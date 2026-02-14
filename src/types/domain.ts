export type UserRole = 'owner' | 'manager' | 'staff';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    status: LeadStatus;
    source: string;
    createdAt: string;
    lastActivityAt: string;
    notes?: string;
    isStarred?: boolean;
    isArchived?: boolean;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
    id: string;
    leadId: string;
    serviceId: string; // Placeholder for now
    date: string; // ISO date string
    time: string; // HH:mm
    duration: number; // in minutes
    status: BookingStatus;
    staffId?: string; // Assigned staff
    notes?: string;
    createdAt: string;
}

export interface Attachment {
    id: string;
    name: string;
    url: string; // Blob URL for now
    type: 'image' | 'document' | 'other';
    size: number;
}

export interface Message {
    id: string;
    leadId: string;
    senderId: 'system' | string; // 'system' or user ID
    content: string;
    createdAt: string;
    readAt?: string;
    attachments?: Attachment[];
}

// Availability as defined in earlier plan, compatible with store limit
export interface Availability {
    days: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    start: string; // HH:mm
    end: string; // HH:mm
}

export interface BusinessSettings {
    businessName: string;
    contactEmail: string;
    contactPhone?: string;
    currency: string;
    availability: Availability;
    integrations: {
        emailProvider: boolean; // e.g. Gmail/Outlook connected
        smsProvider: boolean; // e.g. Twilio connected
        calendar: boolean; // e.g. Google Calendar connected
    };
}

export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    category: string;
    quantity: number;
    threshold: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
    lastUpdated: string;
}

export interface FormField {
    id: string;
    type: 'text' | 'email' | 'textarea' | 'checkbox' | 'date' | 'phone';
    label: string;
    required: boolean;
    options?: string[]; // For select/radio if needed later
}

export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number; // minutes
    price: number; // 0 for free
    intakeFormId?: string; // Optional link to a form
}
export interface Form {
    id: string;
    title: string;
    description?: string;
    type: 'contact' | 'intake';
    fields: FormField[];
    createdAt: string;
    updatedAt: string;
    isPublished: boolean;
}

export interface FormSubmission {
    id: string;
    formId: string;
    leadId?: string; // If applicable
    data: Record<string, unknown>;
    submittedAt: string;
}

export type AutomationEventType =
    | 'LEAD_CREATED'
    | 'LEAD_STATUS_CHANGED'
    | 'BOOKING_CREATED'
    | 'BOOKING_CONFIRMED'
    | 'INTAKE_FORM_SENT'
    | 'MESSAGE_SENT'
    | 'INVENTORY_LOW';

export interface AutomationEvent {
    id: string;
    type: AutomationEventType;
    payload: Record<string, unknown>;
    createdAt: string;
    processed: boolean;
}

export interface ActivityItem {
    id: string;
    type: 'lead' | 'booking' | 'message' | 'system';
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
}
