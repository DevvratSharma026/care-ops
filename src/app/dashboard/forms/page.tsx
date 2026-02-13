'use client';

import { useState } from 'react';
import { useBusinessStore } from '@/lib/store';
import { Plus, FileText, MoreVertical, Loader, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function FormsPage() {
    const { forms } = useBusinessStore();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
                    <p className="text-gray-500">Create and manage intake forms and questionnaires.</p>
                </div>
                <Link
                    href="/dashboard/forms/builder"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Create Form
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map(form => (
                    <div key={form.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="relative">
                                    <button className="text-gray-400 hover:text-gray-600 p-1">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{form.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{form.description || 'No description provided.'}</p>

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                <span>{form.fields.length} questions</span>
                                <span className={form.isPublished ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                                    {form.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/dashboard/forms/builder?id=${form.id}`} className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                <Edit2 className="w-3 h-3" /> Edit
                            </Link>
                        </div>
                    </div>
                ))}

                {forms.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <div className="mx-auto w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No forms yet</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create your first intake form to collect information from clients before their appointment.</p>
                        <Link
                            href="/dashboard/forms/builder"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Create Form
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
