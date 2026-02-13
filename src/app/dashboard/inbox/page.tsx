import Inbox from '@/components/inbox/Inbox';

export default function InboxPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage client communications.
                    </p>
                </div>
            </div>
            <Inbox />
        </div>
    );
}
