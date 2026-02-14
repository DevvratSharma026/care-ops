'use client';

import { useState } from 'react';
import { useBusinessStore } from '@/lib/store';
import { Mail, Phone, User, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';


export default function ContactPage() {
    const { addLead, settings } = useBusinessStore();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create Lead
        addLead({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            source: 'Website Contact Form',
            status: 'new',
            notes: formData.message,
            company: '' // Optional
        });

        // In a real app we'd also trigger the "Message Received" event/action to populate Inbox
        // For now `addLead` triggers "LEAD_CREATED" which automation handles.
        // We might want to explicitly add the message to inbox?
        // Let's rely on Automation for now, or Dispatch a MESSAGE_SENT event manually?
        // Integrating properly:
        // The store `addLead` is good. 
        // We should probably also add the message to the inbox so it shows up as a conversation.
        // But we don't have the new Lead ID here easily (same issue as booking).
        // For prototype, `addLead` is sufficient.

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you {formData.name}. We have received your message and will get back to you shortly at {formData.email}.
                </p>
                <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '' }); }}
                    className="text-indigo-600 font-medium hover:underline flex items-center justify-center gap-2"
                >
                    Send another message
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Have questions about our services? Ready to get started?
                    Fill out the form and our team will be in touch within 24 hours.
                </p>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center flex-none">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Email Us</h3>
                            <p className="text-gray-600">{settings?.contactEmail || 'contact@example.com'}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center flex-none">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Call Us</h3>
                            <p className="text-gray-600">{settings?.contactPhone || '+1 (555) 000-0000'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="tel"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <div className="relative">
                            <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <textarea
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                rows={4}
                                placeholder="How can we help you?"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
