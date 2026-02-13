'use client';

import { useState } from 'react';
import LeadTable from '@/components/leads/LeadTable';
import LeadForm from '@/components/leads/LeadForm';
import Modal from '@/components/ui/Modal';
import { Plus, Filter, Download } from 'lucide-react';
import { useBusinessStore } from '@/lib/store';

export default function LeadsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const { leads } = useBusinessStore();

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...leads.map(lead => [
                lead.id,
                `"${lead.name}"`,
                lead.email,
                lead.phone,
                `"${lead.company}"`,
                lead.status,
                lead.source,
                lead.createdAt
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'leads_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const toggleFilter = () => {
        // Simple toggle for demo: Show 'new' or 'all'
        // Ideally a dropdown, but keeping it simple as per prompt
        setFilterStatus(prev => prev === 'new' ? null : 'new');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Track and manage your potential customers.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleFilter}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors ${filterStatus ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        <Filter className="h-4 w-4" />
                        {filterStatus ? 'Filter: New' : 'Filter'}
                    </button>
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Lead
                    </button>
                </div>
            </div>

            <LeadTable filterStatus={filterStatus} />

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Lead"
            >
                <LeadForm
                    onSuccess={() => setIsAddModalOpen(false)}
                    onCancel={() => setIsAddModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
