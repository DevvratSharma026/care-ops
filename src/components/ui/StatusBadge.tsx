import clsx from 'clsx';

export type StatusType = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

interface StatusBadgeProps {
    status: StatusType;
}

const styles: Record<StatusType, string> = {
    new: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    contacted: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    qualified: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    proposal: 'bg-purple-50 text-purple-700 ring-purple-600/20',
    won: 'bg-green-50 text-green-700 ring-green-600/20',
    lost: 'bg-gray-50 text-gray-600 ring-gray-500/10',
};

const labels: Record<StatusType, string> = {
    new: 'New Lead',
    contacted: 'Contacted',
    qualified: 'Qualified',
    proposal: 'Proposal Sent',
    won: 'Closed Won',
    lost: 'Closed Lost',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                styles[status]
            )}
        >
            {labels[status]}
        </span>
    );
}
