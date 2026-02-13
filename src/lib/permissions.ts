import { UserRole } from '@/types/domain';

export type Permission =
    | 'VIEW_LEADS'
    | 'MANAGE_LEADS'
    | 'VIEW_BOOKINGS'
    | 'MANAGE_BOOKINGS'
    | 'VIEW_INVENTORY'
    | 'MANAGE_INVENTORY'
    | 'VIEW_STAFF'
    | 'MANAGE_STAFF'
    | 'REPLY_INBOX'
    | 'CONFIGURE_SETTINGS';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    owner: [
        'VIEW_LEADS', 'MANAGE_LEADS',
        'VIEW_BOOKINGS', 'MANAGE_BOOKINGS',
        'VIEW_INVENTORY', 'MANAGE_INVENTORY',
        'VIEW_STAFF', 'MANAGE_STAFF',
        'REPLY_INBOX', 'CONFIGURE_SETTINGS'
    ],
    manager: [
        'VIEW_LEADS', 'MANAGE_LEADS',
        'VIEW_BOOKINGS', 'MANAGE_BOOKINGS',
        'VIEW_INVENTORY', 'MANAGE_INVENTORY',
        'VIEW_STAFF', // Can view but not manage staff (invite/delete) - adjusting per requirement "Manager -> leads + bookings + inbox"
        'REPLY_INBOX'
    ],
    staff: [
        'VIEW_LEADS',
        'VIEW_BOOKINGS',
        'VIEW_INVENTORY',
        'REPLY_INBOX'
    ]
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};
