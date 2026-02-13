'use client';

import { useState } from 'react';
import { useBusinessStore } from '@/lib/store';
import Modal from '@/components/ui/Modal';
import { UserRole } from '@/types/domain';
import { sendEmail } from '@/app/actions';

type ActionType = 'booking' | 'lead' | 'invoice' | 'staff' | null;

export default function QuickActions() {
    const [openModal, setOpenModal] = useState<ActionType>(null);
    const { addLead, addBooking, addStaff, leads } = useBusinessStore();

    // Form States
    const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', company: '' });
    const [bookingForm, setBookingForm] = useState({ leadId: '', date: '', time: '', serviceId: 's-1' });
    const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'staff' as UserRole });
    const [invoiceForm, setInvoiceForm] = useState({ leadId: '', amount: '' });

    const handleClose = () => {
        setOpenModal(null);
        // Reset forms
        setLeadForm({ name: '', email: '', phone: '', company: '' });
        setBookingForm({ leadId: '', date: '', time: '', serviceId: 's-1' });
        setStaffForm({ name: '', email: '', role: 'staff' });
        setInvoiceForm({ leadId: '', amount: '' });
    };

    const handleSubmitLead = (e: React.FormEvent) => {
        e.preventDefault();
        addLead({
            ...leadForm,
            status: 'new',
            source: 'Dashboard Quick Action',
        });
        handleClose();
    };

    const handleSubmitBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingForm.leadId) return alert('Please select a lead');
        addBooking({
            leadId: bookingForm.leadId,
            serviceId: bookingForm.serviceId,
            date: bookingForm.date,
            time: bookingForm.time,
            duration: 60, // Default duration
        });
        handleClose();
    };

    const handleSubmitStaff = (e: React.FormEvent) => {
        e.preventDefault();
        addStaff({
            ...staffForm,
            role: staffForm.role as UserRole,
        });
        handleClose();
    };

    const handleSubmitInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoiceForm.leadId) return alert('Please select a lead');
        const lead = leads.find(l => l.id === invoiceForm.leadId);

        if (lead && lead.email) {
            await sendEmail(
                lead.email,
                `Invoice from CareOps`,
                `<p>Hi ${lead.name},</p><p>Please find attached your invoice for $${invoiceForm.amount}.</p>`
            );
            alert(`Invoice for $${invoiceForm.amount} sent to ${lead.name} (${lead.email})`);
        } else {
            alert('Lead not found or missing email');
        }
        handleClose();
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setOpenModal('booking')}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                    <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">
                        New Booking
                    </span>
                </button>
                <button
                    onClick={() => setOpenModal('lead')}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                    <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">
                        Create Lead
                    </span>
                </button>
                <button
                    onClick={() => setOpenModal('invoice')}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                    <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">
                        Send Invoice
                    </span>
                </button>
                <button
                    onClick={() => setOpenModal('staff')}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                    <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">
                        Add Staff
                    </span>
                </button>
            </div>

            {/* Booking Modal */}
            {openModal === 'booking' && (
                <Modal isOpen={true} onClose={handleClose} title="New Booking">
                    <form onSubmit={handleSubmitBooking} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Client / Lead</label>
                            <select
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={bookingForm.leadId}
                                onChange={e => setBookingForm({ ...bookingForm, leadId: e.target.value })}
                            >
                                <option value="">Select a client...</option>
                                {leads.map(lead => (
                                    <option key={lead.id} value={lead.id}>{lead.name} ({lead.company})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={bookingForm.date}
                                onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Time</label>
                            <input
                                type="time"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={bookingForm.time}
                                onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                            >
                                Create Booking
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Lead Modal */}
            {openModal === 'lead' && (
                <Modal isOpen={true} onClose={handleClose} title="Create New Lead">
                    <form onSubmit={handleSubmitLead} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={leadForm.name}
                                onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={leadForm.email}
                                onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={leadForm.company}
                                onChange={e => setLeadForm({ ...leadForm, company: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={leadForm.phone}
                                onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                            >
                                Add Lead
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Invoice Modal */}
            {openModal === 'invoice' && (
                <Modal isOpen={true} onClose={handleClose} title="Send Invoice">
                    <form onSubmit={handleSubmitInvoice} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Client / Lead</label>
                            <select
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={invoiceForm.leadId}
                                onChange={e => setInvoiceForm({ ...invoiceForm, leadId: e.target.value })}
                            >
                                <option value="">Select a client...</option>
                                {leads.map(lead => (
                                    <option key={lead.id} value={lead.id}>{lead.name} ({lead.company})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={invoiceForm.amount}
                                onChange={e => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                            >
                                Send Invoice
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Staff Modal */}
            {openModal === 'staff' && (
                <Modal isOpen={true} onClose={handleClose} title="Add Staff Member">
                    <form onSubmit={handleSubmitStaff} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={staffForm.name}
                                onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={staffForm.email}
                                onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={staffForm.role}
                                onChange={e => setStaffForm({ ...staffForm, role: e.target.value as UserRole })}
                            >
                                <option value="staff">Staff</option>
                                <option value="manager">Manager</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                            >
                                Add Staff
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
