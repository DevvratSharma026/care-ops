'use client';

import { useState } from 'react';
import { MoreHorizontal, Mail, Phone, Calendar } from 'lucide-react';
import StatusBadge, { StatusType } from '../ui/StatusBadge';
import { useBusinessStore } from '@/lib/store';

interface LeadTableProps {
    filterStatus?: string | null;
}

export default function LeadTable({ filterStatus }: LeadTableProps) {
    const { leads } = useBusinessStore();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter leads
    const filteredLeads = leads.filter(lead => {
        if (!filterStatus) return true;
        return lead.status === filterStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.NumberFormat('en-US', { style: 'unit', unit: 'hour' }).format(
                Math.round((Date.now() - date.getTime()) / 3600000)
            ) + ' hours ago';
        } catch (e) {
            return dateString;
        }
    };

    // Better relative time helper
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lead Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact Info
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Source
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date Added
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedLeads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No leads found.
                                </td>
                            </tr>
                        ) : (
                            paginatedLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                                                    {lead.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                                <div className="text-sm text-gray-500">{lead.company || '-'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-gray-400" />
                                            {lead.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <Phone className="h-3 w-3 text-gray-400" />
                                            {lead.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={lead.status as StatusType} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {lead.source}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span title={new Date(lead.createdAt).toLocaleString()}>
                                            {getRelativeTime(lead.createdAt)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    Showing {paginatedLeads.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} results
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
