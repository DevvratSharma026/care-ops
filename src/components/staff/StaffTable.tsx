'use client';

import { MoreHorizontal, Shield, Mail, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useBusinessStore } from '@/lib/store';
import { UserRole } from '@/types/domain';

export default function StaffTable() {
    const { staff, removeStaff, currentUser } = useBusinessStore();

    const canManageStaff = currentUser?.role === 'owner' || currentUser?.role === 'manager';

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Member
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Active
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {staff.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                                {member.avatarUrl || member.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                            <div className="text-sm text-gray-500">{member.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-900">
                                        <Shield className="mr-1.5 h-4 w-4 text-gray-400" />
                                        <span className="capitalize">{member.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={clsx(
                                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                            'bg-green-100 text-green-800' // Assuming all are active for now
                                        )}
                                    >
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Just now
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {canManageStaff && currentUser && member.id !== currentUser.id && (
                                        <button
                                            onClick={() => removeStaff(member.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                            title="Remove Staff"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
