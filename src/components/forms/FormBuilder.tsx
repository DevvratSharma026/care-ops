'use client';

import { useState } from 'react';
import { Type, CheckSquare, AlignLeft, Calendar, Mail, Phone, ChevronRight, GripVertical, Plus, Eye, Save } from 'lucide-react';
import clsx from 'clsx';
import { useBusinessStore } from '@/lib/store';
import { FormField } from '@/types/domain';
import { useToast } from '@/components/ui/ToastContext';
import Modal from '@/components/ui/Modal';

const initialFields: FormField[] = [
    { id: '1', type: 'text', label: 'Full Name', required: true },
    { id: '2', type: 'email', label: 'Email Address', required: true },
    { id: '3', type: 'phone', label: 'Phone Number', required: false },
    { id: '4', type: 'textarea', label: 'Message', required: false },
];

const fieldTypes = [
    { type: 'text', icon: Type, label: 'Text Input' },
    { type: 'email', icon: Mail, label: 'Email' },
    { type: 'phone', icon: Phone, label: 'Phone' },
    { type: 'textarea', icon: AlignLeft, label: 'Long Text' },
    { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
    { type: 'date', icon: Calendar, label: 'Date' },
];

export default function FormBuilder() {
    const { saveForm } = useBusinessStore();
    const { addToast } = useToast();

    // Form State
    const [fields, setFields] = useState<FormField[]>(initialFields);
    const [activeFormTitle, setActiveFormTitle] = useState('Contact Us');

    // UI State
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Form Simulation State (for Preview)
    const [formValues, setFormValues] = useState<Record<string, string | boolean>>({});
    const [submitted, setSubmitted] = useState(false);

    const addField = (type: string) => {
        const newField: FormField = {
            id: crypto.randomUUID(),
            type: type as FormField['type'],
            label: `New ${type} field`,
            required: false,
        };
        setFields([...fields, newField]);
        addToast(`${type} field added to form`, 'info', 2000);
    };

    const handleInputChange = (label: string, value: string | boolean) => {
        setFormValues(prev => ({
            ...prev,
            [label]: value
        }));
    };

    const handleSaveForm = () => {
        saveForm({
            id: 'contact-form-1', // In real app, generate ID or use existing
            title: activeFormTitle,
            type: 'contact',
            fields: fields,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublished: true
        });
        addToast('Form saved successfully!', 'success');
    };

    const handleSubmitPreview = () => {
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormValues({});
            setIsPreviewOpen(false);
            addToast('Form submission simulated!', 'success');
        }, 2000);
    };

    const renderFieldInput = (field: FormField) => {
        const commonClasses = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-white";

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        className={commonClasses}
                        rows={3}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                    />
                );
            case 'checkbox':
                return (
                    <div className="flex items-center h-6">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            onChange={(e) => handleInputChange(field.label, e.target.checked)}
                        />
                        <span className="ml-3 text-sm leading-6 text-gray-600">Yes, I agree</span>
                    </div>
                );
            case 'date':
                return (
                    <input
                        type="date"
                        className={commonClasses}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                    />
                );
            default:
                return (
                    <input
                        type={field.type}
                        className={commonClasses}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                    />
                );
        }
    };

    return (
        <div className="flex h-[calc(100vh-12rem)] gap-6">
            {/* Sidebar - Field Types */}
            <div className="w-64 flex-none bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-medium text-gray-900">Fields</h3>
                </div>
                <div className="p-3 grid gap-2 overflow-y-auto">
                    {fieldTypes.map((item) => (
                        <button
                            key={item.type}
                            onClick={() => addField(item.type)}
                            className="flex items-center gap-3 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all group"
                        >
                            <item.icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                            {item.label}
                            <Plus className="w-4 h-4 text-gray-300 ml-auto opacity-0 group-hover:opacity-100" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Canvas - Form Editor */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">Editing:</span>
                        <input
                            type="text"
                            value={activeFormTitle}
                            onChange={(e) => setActiveFormTitle(e.target.value)}
                            className="font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsPreviewOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                        <button
                            onClick={handleSaveForm}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            Save Form
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-8 min-h-[500px]">
                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">{activeFormTitle}</h1>
                            <p className="text-gray-500 mt-2">Fill out the form below to get in touch with us.</p>
                        </div>

                        <div className="space-y-6">
                            {submitted ? (
                                <div className="text-center py-12 text-green-600 bg-green-50 rounded-lg">
                                    <CheckSquare className="w-12 h-12 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium">Thank you!</h3>
                                    <p>Your submission has been received.</p>
                                </div>
                            ) : (
                                <>
                                    {fields.map((field) => (
                                        <div key={field.id} className="group relative p-4 rounded-lg border border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 -mx-4 transition-all">
                                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-gray-400 hover:text-indigo-500">
                                                <GripVertical className="w-4 h-4" />
                                            </div>

                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>

                                            <div>
                                                {renderFieldInput(field)}
                                            </div>
                                        </div>
                                    ))}

                                    {fields.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                                            <p className="text-gray-500 text-sm">Drag or click fields from the sidebar to add them here.</p>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-gray-100 mt-6">
                                        <button
                                            onClick={handleSubmitPreview}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Submit
                                        </button>
                                        <p className="text-center text-xs text-gray-400 mt-2">Submitting here simulates the user experience</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Form Preview">
                <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-xl font-bold text-gray-900">{activeFormTitle}</h2>
                        <p className="text-sm text-gray-500 mt-1">This is how your form will look to visitors.</p>
                    </div>

                    {submitted ? (
                        <div className="text-center py-8 text-green-600 bg-green-50 rounded-lg">
                            <CheckSquare className="w-12 h-12 mx-auto mb-3" />
                            <h3 className="text-lg font-medium">Thank you!</h3>
                            <p>Your submission has been received.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {fields.map((field) => (
                                <div key={field.id}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {renderFieldInput(field)}
                                </div>
                            ))}
                            <div className="pt-4">
                                <button
                                    onClick={handleSubmitPreview}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Submit Form
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
