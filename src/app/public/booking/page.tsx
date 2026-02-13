'use client';

import { useState } from 'react';
import { useBusinessStore } from '@/lib/store';
import { Calendar, Clock, Check, User, Mail, FileText, CheckCircle } from 'lucide-react';
import { Service } from '@/types/domain';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

type Step = 'service' | 'datetime' | 'details' | 'intake' | 'confirmation';

export default function BookingPage() {
    const { services, settings, addBooking, addLead, forms, submitForm } = useBusinessStore();
    const router = useRouter();

    const [step, setStep] = useState<Step>('service');
    // We store service ID primarily, but derivation is easy
    const [bookingData, setBookingData] = useState<{
        serviceId: string;
        date: string;
        time: string;
        name: string;
        email: string;
        phone: string;
        notes: string;
    }>({
        serviceId: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    const [formData, setFormData] = useState<Record<string, any>>({});

    const selectedService = services.find(s => s.id === bookingData.serviceId);
    const linkedForm = selectedService?.intakeFormId ? forms.find(f => f.id === selectedService.intakeFormId) : null;

    // derived steps
    const steps: { id: Step; title: string }[] = [
        { id: 'service', title: 'Service' },
        { id: 'datetime', title: 'Date & Time' },
        { id: 'details', title: 'Your Details' },
        ...(linkedForm ? [{ id: 'intake', title: 'Intake' } as const] : []),
        { id: 'confirmation', title: 'Confirmation' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === step);

    // Mock Time Slots Generator
    const generateTimeSlots = () => {
        const slots = [];
        const startStr = settings?.availability?.start || '09:00';
        const endStr = settings?.availability?.end || '17:00';
        const start = parseInt(startStr.split(':')[0]);
        const end = parseInt(endStr.split(':')[0]);

        for (let i = start; i < end; i++) {
            slots.push(`${i}:00`);
            slots.push(`${i}:30`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Mock Date Generator (Next 7 days)
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1); // Start tomorrow
        return d.toISOString().split('T')[0];
    });

    const handleNext = () => {
        if (step === 'service' && bookingData.serviceId) {
            setStep('datetime');
        } else if (step === 'datetime' && bookingData.date && bookingData.time) {
            setStep('details');
        } else if (step === 'details' && bookingData.name && bookingData.email) {
            if (linkedForm) {
                setStep('intake');
            } else {
                handleSubmit();
            }
        } else if (step === 'intake') {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step === 'datetime') setStep('service');
        else if (step === 'details') setStep('datetime');
        else if (step === 'intake') setStep('details');
        else if (step === 'confirmation') setStep('service');
    };

    const handleSubmit = () => {
        if (!selectedService) return;

        // 1. Create Lead
        // For prototype, we blindly create. Real app would check email.
        addLead({
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            status: 'new',
            source: 'Booking Page',
            notes: bookingData.notes
        });

        // 2. Create Booking
        // In a real app we'd wait for lead ID. Here we rely on async eventual consistency or just unlinked for now.
        const leadId = crypto.randomUUID(); // Placeholder ID for the immediate booking creation

        addBooking({
            leadId: 'pending-lead-link', // System would link this normally
            serviceId: bookingData.serviceId,
            date: bookingData.date,
            time: bookingData.time,
            duration: selectedService.duration,
            notes: bookingData.notes
        });

        // 3. Submit Form
        if (linkedForm) {
            submitForm(linkedForm.id, {
                ...formData,
                leadEmail: bookingData.email,
                submissionDate: new Date().toISOString()
            });
        }

        setStep('confirmation');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Steps Indicator */}
            {step !== 'confirmation' && (
                <div className="mb-8">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
                        {steps.slice(0, -1).map((s, i) => (
                            <div key={s.id} className={clsx("flex flex-col items-center gap-2 bg-white px-2", i <= currentStepIndex ? "text-indigo-600" : "text-gray-400")}>
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                                    steps.findIndex(stepObj => stepObj.id === s.id) <= currentStepIndex ? "bg-indigo-600 border-indigo-600 text-white" :
                                        "border-gray-200 text-gray-400 bg-white"
                                )}>
                                    {steps.findIndex(stepObj => stepObj.id === s.id) + 1}
                                </div>
                                <span className="text-xs font-medium hidden sm:block">{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Step 1: Service Selection */}
                {step === 'service' && (
                    <div className="p-8">
                        <h2 className="text-xl font-semibold mb-6">Select a Service</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map(service => (
                                <button
                                    key={service.id}
                                    onClick={() => setBookingData({ ...bookingData, serviceId: service.id })}
                                    className={clsx(
                                        "flex flex-col items-start p-6 rounded-xl border-2 transition-all text-left",
                                        bookingData.serviceId === service.id
                                            ? "border-indigo-600 bg-indigo-50"
                                            : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                                    )}
                                >
                                    <div className="font-semibold text-gray-900 mb-2">{service.name}</div>
                                    <p className="text-sm text-gray-500 mb-4 flex-grow">{service.description}</p>
                                    <div className="flex items-center justify-between w-full mt-auto">
                                        <span className={clsx(
                                            "inline-flex items-center text-xs font-medium px-2 py-1 rounded-md",
                                            bookingData.serviceId === service.id ? "bg-indigo-200 text-indigo-800" : "bg-gray-100 text-gray-600"
                                        )}>
                                            <Clock className="w-3 h-3 mr-1" />
                                            {service.duration} mins
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {service.price === 0 ? 'Free' : `$${service.price}`}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Date & Time */}
                {step === 'datetime' && (
                    <div className="p-8">
                        <h2 className="text-xl font-semibold mb-6">Select Date & Time</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-indigo-500" /> Date
                                </h3>
                                <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                                    {dates.map(date => (
                                        <button
                                            key={date}
                                            onClick={() => setBookingData({ ...bookingData, date: date })}
                                            className={clsx(
                                                "w-full text-left px-4 py-3 rounded-lg text-sm transition-colors border",
                                                bookingData.date === date
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                                    : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                                            )}
                                        >
                                            {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-indigo-500" /> Time
                                </h3>
                                {!bookingData.date ? (
                                    <div className="text-sm text-gray-500 text-center py-8 border border-dashed rounded-lg bg-gray-50">
                                        Please select a date first
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
                                        {timeSlots.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setBookingData({ ...bookingData, time: time })}
                                                className={clsx(
                                                    "w-full py-2 rounded-lg text-sm border transition-all",
                                                    bookingData.time === time
                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-medium"
                                                        : "border-gray-200 hover:border-indigo-300 text-gray-600"
                                                )}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Details */}
                {step === 'details' && (
                    <div className="p-8">
                        <h2 className="text-xl font-semibold mb-6">Your Details</h2>
                        <div className="space-y-4 max-w-lg mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        value={bookingData.name}
                                        onChange={e => setBookingData({ ...bookingData, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        value={bookingData.email}
                                        onChange={e => setBookingData({ ...bookingData, email: e.target.value })}
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    value={bookingData.phone}
                                    onChange={e => setBookingData({ ...bookingData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                <div className="relative">
                                    <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-24 resize-none"
                                        value={bookingData.notes}
                                        onChange={e => setBookingData({ ...bookingData, notes: e.target.value })}
                                        placeholder="Anything else we should know?"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Intake Form (Optional) */}
                {step === 'intake' && linkedForm && (
                    <div className="p-8">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl font-semibold mb-2">{linkedForm.title}</h2>
                            <p className="text-gray-500 mb-8">{linkedForm.description || 'Please answer the following questions to help us prepare.'}</p>

                            <div className="space-y-6">
                                {linkedForm.fields.map(field => (
                                    <div key={field.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <label className="block text-sm font-medium text-gray-900 mb-3">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>

                                        {field.type === 'text' && (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                                value={formData[field.id] || ''}
                                                onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                                                placeholder="Your answer..."
                                            />
                                        )}
                                        {field.type === 'textarea' && (
                                            <textarea
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-24 resize-none bg-white"
                                                value={formData[field.id] || ''}
                                                onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                                                placeholder="Type here..."
                                            />
                                        )}
                                        {field.type === 'checkbox' && (
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    checked={!!formData[field.id]}
                                                    onChange={e => setFormData({ ...formData, [field.id]: e.target.checked })}
                                                />
                                                <span className="text-gray-700">Yes, I confirm</span>
                                            </label>
                                        )}
                                        {field.type === 'date' && (
                                            <input
                                                type="date"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                                value={formData[field.id] || ''}
                                                onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Confirmation */}
                {step === 'confirmation' && (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                            Thank you, {bookingData.name.split(' ')[0]}. Your appointment for <span className="font-semibold text-gray-900">{selectedService?.name}</span> on {bookingData.date} at {bookingData.time} has been scheduled.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    setStep('service');
                                    setBookingData({ serviceId: '', date: '', time: '', name: '', email: '', phone: '', notes: '' });
                                    setFormData({});
                                }}
                                className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-medium transition-colors shadow-lg shadow-gray-200"
                            >
                                Book Another Appointment
                            </button>
                        </div>
                    </div>
                )}

                {/* Navigation Footer */}
                {step !== 'confirmation' && (
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            disabled={currentStepIndex === 0}
                            className="px-6 py-2 rounded-lg text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={
                                (step === 'service' && !bookingData.serviceId) ||
                                (step === 'datetime' && (!bookingData.date || !bookingData.time)) ||
                                (step === 'details' && (!bookingData.name || !bookingData.email))
                                // Add validation for intake form
                            }
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {/* If next step is confirmation, show Confirm, else Continue */}
                            {step === 'intake' || (step === 'details' && !linkedForm) ? 'Confirm Booking' : 'Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
