'use client';

import { useState } from 'react';
import InventoryTable from '@/components/inventory/InventoryTable';
import { Plus, Download, Package } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useBusinessStore } from '@/lib/store';
import { useToast } from '@/components/ui/ToastContext';

export default function InventoryPage() {
    const { inventory, addInventoryItem } = useBusinessStore();
    const { addToast } = useToast();

    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        sku: '',
        category: 'Supplies',
        quantity: 0,
        threshold: 10
    });

    const handleExport = () => {
        const headers = ['Name', 'SKU', 'Category', 'Quantity', 'Status', 'Last Updated'];
        const csvContent = [
            headers.join(','),
            ...inventory.map(item =>
                [item.name, item.sku, item.category, item.quantity, item.status, item.lastUpdated].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast('Inventory exported successfully', 'success');
    };

    const handleAddItem = () => {
        if (!newItem.name || !newItem.sku) {
            addToast('Please fill in Name and SKU', 'error');
            return;
        }

        addInventoryItem({
            name: newItem.name,
            sku: newItem.sku,
            category: newItem.category,
            quantity: Number(newItem.quantity),
            threshold: Number(newItem.threshold)
        });

        addToast('Item added successfully', 'success');
        setIsAddItemModalOpen(false);
        setNewItem({ name: '', sku: '', category: 'Supplies', quantity: 0, threshold: 10 });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Track products, supplies, and assets.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsAddItemModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Item
                    </button>
                </div>
            </div>

            <InventoryTable />

            <Modal
                isOpen={isAddItemModalOpen}
                onClose={() => setIsAddItemModalOpen(false)}
                title="Add New Item"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="e.g. Office Chairs"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SKU</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="e.g. OFF-001"
                            value={newItem.sku}
                            onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            >
                                <option>Supplies</option>
                                <option>Materials</option>
                                <option>Merchandise</option>
                                <option>Equipment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            value={newItem.threshold}
                            onChange={(e) => setNewItem({ ...newItem, threshold: Number(e.target.value) })}
                        />
                        <p className="mt-1 text-xs text-gray-500">Alert when quantity falls below this number.</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            onClick={() => setIsAddItemModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddItem}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                        >
                            <Package className="w-4 h-4" />
                            Add Item
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
