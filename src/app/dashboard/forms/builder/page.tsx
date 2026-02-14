'use client';

import { useState, useEffect, Suspense } from 'react';
import { useBusinessStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, FormField } from '@/types/domain';
import { Save, Plus, Trash2, GripVertical, CheckSquare, Type, Calendar, ArrowLeft, FileText, Eye, Edit2 } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

function FormBuilderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { forms, saveForm } = useBusinessStore();
    const formId = searchParams.get('id');
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');

    const [form, setForm] = useState<Form>({
        id: crypto.randomUUID(),
        title: 'New Intake Form',
        description: '',
        type: 'intake',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: false
    });

    // Load existing form if editing
    useEffect(() => {
        if (formId) {
            const existingForm = forms.find(f => f.id === formId);
            if (existingForm) {
                // eslint-disable-next-line
                setForm(existingForm);
            }
        }
    }, [formId, forms]);

    const addField = (type: FormField['type']) => {
        const newField: FormField = {
            id: crypto.randomUUID(),
            type,
            label: `New ${type} question`,
            required: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options: type === 'checkbox' || type === 'select' as any ? ['Option 1'] : undefined
        };
        setForm({ ...form, fields: [...form.fields, newField] });
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setForm({
            ...form,
            fields: form.fields.map(f => f.id === id ? { ...f, ...updates } : f)
        });
    };

    const deleteField = (id: string) => {
        setForm({
            ...form,
            fields: form.fields.filter(f => f.id !== id)
        });
    };

    const handleSave = () => {
        saveForm(form);
        router.push('/dashboard/forms');
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col -m-8">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/forms" className="text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="text-xl font-bold text-gray-900 border-none focus:ring-0 p-0 hover:bg-gray-50 rounded px-2 -ml-2 w-full max-w-md"
                            placeholder="Form Title"
                        />
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{form.fields.length} fields</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <select
                                value={form.isPublished ? 'published' : 'draft'}
                                onChange={(e) => setForm({ ...form, isPublished: e.target.value === 'published' })}
                                className="bg-transparent border-none text-sm p-0 focus:ring-0 cursor-pointer hover:text-indigo-600"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
                    <button
                        onClick={() => setMode('edit')}
                        className={clsx(
                            "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all",
                            mode === 'edit' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => setMode('preview')}
                        className={clsx(
                            "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all",
                            mode === 'preview' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                    <Save className="w-4 h-4" />
                    Save Form
                </button>
            </div>

            {mode === 'edit' ? (
                <div className="flex-1 flex overflow-hidden">
                    {/* Tools Sidebar */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-4 overflow-y-auto">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Form Elements</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => addField('text')}
                                className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                            >
                                <Type className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-medium text-gray-700">Short Text</span>
                            </button>
                            <button
                                onClick={() => addField('textarea')}
                                className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                            >
                                <FileText className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-medium text-gray-700">Long Text</span>
                            </button>
                            <button
                                onClick={() => addField('checkbox')}
                                className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                            >
                                <CheckSquare className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-medium text-gray-700">Checkbox</span>
                            </button>
                            <button
                                onClick={() => addField('date')}
                                className="flex items-center gap-3 w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                            >
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-medium text-gray-700">Date Picker</span>
                            </button>
                        </div>

                        <div className="mt-8 p-4 bg-indigo-50 rounded-lg text-xs text-indigo-700">
                            <p className="font-semibold mb-1">Tip:</p>
                            <p>Click elements on the right to edit their properties.</p>
                        </div>
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 bg-gray-100 overflow-y-auto p-8">
                        <div className="max-w-2xl mx-auto space-y-4 pb-20">
                            {/* Form Header Preview */}
                            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h2>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Add a description for your clients..."
                                    className="w-full text-center text-gray-500 border-none focus:ring-0 p-0 resize-none bg-transparent"
                                    rows={2}
                                />
                            </div>

                            {/* Fields */}
                            {form.fields.map((field) => (
                                <div key={field.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group hover:border-indigo-300 transition-colors">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 rounded-l-xl transition-colors" />

                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                                            <GripVertical className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <input
                                                value={field.label}
                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                className="w-full font-medium text-gray-900 border-none focus:ring-0 p-0 bg-transparent text-lg placeholder-gray-300"
                                                placeholder="Question Text"
                                            />

                                            {/* Field Type Specific Usage Preview (Non-interactive) */}
                                            {field.type === 'text' && (
                                                <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-gray-400 text-sm">Short answer text</div>
                                            )}
                                            {field.type === 'textarea' && (
                                                <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-gray-400 text-sm h-20">Long answer text</div>
                                            )}
                                            {field.type === 'checkbox' && (
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <div className="w-4 h-4 border border-gray-300 rounded" />
                                                    <span>User can check this box</span>
                                                </div>
                                            )}
                                            {field.type === 'date' && (
                                                <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-gray-400 text-sm flex items-center justify-between">
                                                    <span>MM/DD/YYYY</span>
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                            )}

                                            <div className="pt-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                            className="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                        />
                                                        Required
                                                    </label>
                                                </div>
                                                <button
                                                    onClick={() => deleteField(field.id)}
                                                    className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {form.fields.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    <p>Drag and drop fields or click to add questions.</p>
                                </div>
                            )}

                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => addField('text')}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium border border-gray-200 border-dashed hover:border-solid hover:border-gray-300 transition-all"
                                >
                                    <Plus className="w-4 h-4" /> Add Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-gray-100 overflow-y-auto p-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h2>
                            <p className="text-gray-500">{form.description}</p>
                        </div>

                        {form.fields.map((field) => (
                            <div key={field.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
                                <label className="block text-sm font-medium text-gray-900">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {field.type === 'text' && (
                                    <input type="text" className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Short answer text" />
                                )}
                                {field.type === 'email' && (
                                    <input type="email" className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder="email@example.com" />
                                )}
                                {field.type === 'phone' && (
                                    <input type="tel" className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" placeholder="(555) 555-5555" />
                                )}
                                {field.type === 'textarea' && (
                                    <textarea className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" rows={3} placeholder="Long answer text" />
                                )}
                                {field.type === 'checkbox' && (
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                                        <span className="text-sm text-gray-700">Yes</span>
                                    </div>
                                )}
                                {field.type === 'date' && (
                                    <input type="date" className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                                )}
                            </div>
                        ))}

                        {form.fields.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <p>No fields to preview.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


export default function FormBuilderPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading builder...</div>}>
            <FormBuilderContent />
        </Suspense>
    );
}
