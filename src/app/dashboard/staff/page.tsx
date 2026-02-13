'use client';

import { useState } from 'react';
import StaffTable from '@/components/staff/StaffTable';
import { Plus, Mail } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useBusinessStore } from '@/lib/store';
import { useToast } from '@/components/ui/ToastContext';

export default function StaffPage() {
    const { addStaff } = useBusinessStore();
    const { addToast } = useToast();

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        role: 'staff' as 'owner' | 'manager' | 'staff'
    });

    const handleInviteMember = () => {
        if (!newMember.name || !newMember.email) {
            addToast('Please fill in all fields', 'error');
            return;
        }

        addStaff({
            name: newMember.name,
            email: newMember.email,
            role: newMember.role,
            avatarUrl: newMember.name.charAt(0).toUpperCase(),
        });

        addToast(`${newMember.name} has been invited successfully`, 'success');
        setIsInviteModalOpen(false);
        setNewMember({ name: '', email: '', role: 'staff' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage team members and their access levels.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Invite Member
                    </button>
                </div>
            </div>

            <StaffTable />

            <Modal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                title="Invite Team Member"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="e.g. John Doe"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="john@careops.com"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                        >
                            <option value="staff">Staff</option>
                            <option value="manager">Manager</option>
                            <option value="owner">Owner</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            onClick={() => setIsInviteModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInviteMember}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                        >
                            <Mail className="w-4 h-4" />
                            Send Invitation
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
