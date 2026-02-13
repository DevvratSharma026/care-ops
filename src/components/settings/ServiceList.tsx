'use client';

import { useState } from 'react';
import { useBusinessStore } from '@/lib/store';
import { Plus, Trash2, Clock, DollarSign, Edit2 } from 'lucide-react';
import { Service } from '@/types/domain';

export default function ServiceList() {
    const { services, addService, forms } = useBusinessStore(); // We'll need delete/update later
    const [isAdding, setIsAdding] = useState(false);
    const [newService, setNewService] = useState<{
        name: string;
        description: string;
        duration: number;
        price: number;
        intakeFormId?: string;
    }>({
        name: '',
        description: '',
        duration: 30,
        price: 0
    });

    const handleAdd = () => {
        if (!newService.name) return;
        addService({
            ...newService,
            duration: Number(newService.duration),
            price: Number(newService.price)
        });
        setIsAdding(false);
        setNewService({ name: '', description: '', duration: 30, price: 0 });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Services</h2>
                    <p className="text-sm text-gray-500">Manage the services you offer to customers.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Service
                </button>
            </div>

            {isAdding && (
                <div className="p-6 bg-indigo-50/50 border-b border-indigo-100 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            placeholder="Service Name"
                            className="px-3 py-2 rounded-lg border border-gray-300"
                            value={newService.name}
                            onChange={e => setNewService({ ...newService, name: e.target.value })}
                        />
                        <input
                            placeholder="Description"
                            className="px-3 py-2 rounded-lg border border-gray-300"
                            value={newService.description}
                            onChange={e => setNewService({ ...newService, description: e.target.value })}
                        />
                        <div className="relative">
                            <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="number"
                                placeholder="Duration (min)"
                                className="w-full pl-9 px-3 py-2 rounded-lg border border-gray-300"
                                value={newService.duration}
                                onChange={e => setNewService({ ...newService, duration: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="relative">
                            <DollarSign className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="number"
                                placeholder="Price"
                                className="w-full pl-9 px-3 py-2 rounded-lg border border-gray-300"
                                value={newService.price}
                                onChange={e => setNewService({ ...newService, price: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Intake Form (Optional)</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                                value={newService.intakeFormId || ''}
                                onChange={e => setNewService({ ...newService, intakeFormId: e.target.value || undefined })}
                            >
                                <option value="">No form required</option>
                                {forms.map(form => (
                                    <option key={form.id} value={form.id}>{form.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm">Cancel</button>
                        <button onClick={handleAdd} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Save Service</button>
                    </div>
                </div>
            )}

            <div className="divide-y divide-gray-100">
                {services.map(service => (
                    <div key={service.id} className="p-6 hover:bg-gray-50 transition flex justify-between items-center group">
                        <div>
                            <h3 className="font-medium text-gray-900">{service.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{service.description}</p>
                            <div className="flex gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration} min</span>
                                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${service.price}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            {/* We need deleteService action */}
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {services.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        No services added yet.
                    </div>
                )}
            </div>
        </div>
    );
}
