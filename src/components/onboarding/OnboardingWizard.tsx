'use client';

import { useState } from 'react';
import { useBusinessStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Clock, Check, ArrowRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';

export default function OnboardingWizard() {
    const { settings, updateSettings, addService } = useBusinessStore();
    const [isOpen, setIsOpen] = useState(settings.businessName === 'My Business');
    const [step, setStep] = useState(1);

    const [businessName, setBusinessName] = useState(settings.businessName === 'My Business' ? '' : settings.businessName);
    const [email, setEmail] = useState(settings.contactEmail);
    const [startTime, setStartTime] = useState(settings.availability.start);
    const [endTime, setEndTime] = useState(settings.availability.end);

    // Quick Service Setup
    const [serviceName, setServiceName] = useState('Initial Consultation');
    const [servicePrice, setServicePrice] = useState('0');
    const [serviceDuration, setServiceDuration] = useState('30');

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 3) {
            handleComplete();
        } else {
            setStep(step + 1);
        }
    };

    const handleComplete = () => {
        // 1. Update Settings
        updateSettings({
            ...settings,
            businessName: businessName || 'My Business',
            contactEmail: email,
            availability: {
                ...settings.availability,
                start: startTime,
                end: endTime
            }
        });

        // 2. Add Initial Service
        if (serviceName) {
            addService({
                name: serviceName,
                description: 'Standard appointment',
                duration: parseInt(serviceDuration),
                price: parseInt(servicePrice)
            });
        }

        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header with Progress */}
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Welcome to CareOps!</h2>
                        <p className="text-indigo-100">Let&apos;s get your business set up in just a minute.</p>

                        <div className="flex gap-2 mt-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={clsx("h-1.5 rounded-full flex-1 transition-all", i <= step ? "bg-white" : "bg-indigo-500/50")} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-grow">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                                    <Building2 className="w-6 h-6" />
                                    <h3 className="text-lg font-semibold">Business Basics</h3>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                        placeholder="e.g. Acme Clinic"
                                        value={businessName}
                                        onChange={e => setBusinessName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                        placeholder="contact@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                                    <Clock className="w-6 h-6" />
                                    <h3 className="text-lg font-semibold">Standard Hours</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                            value={startTime}
                                            onChange={e => setStartTime(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                            value={endTime}
                                            onChange={e => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    We&apos;ll set this as your default availability for weekdays. You can customize this later in Settings.
                                </p>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                                    <Check className="w-6 h-6" />
                                    <h3 className="text-lg font-semibold">Create First Service</h3>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">Add a service so customers can start booking immediately.</p>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                        value={serviceName}
                                        onChange={e => setServiceName(e.target.value)}
                                        placeholder="e.g. Free Consultation"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                            value={servicePrice}
                                            onChange={e => setServicePrice(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900"
                                            value={serviceDuration}
                                            onChange={e => setServiceDuration(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Skip for now
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={step === 1 && !businessName}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        {step === 3 ? 'Get Started' : 'Next Step'}
                        {step !== 3 && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
