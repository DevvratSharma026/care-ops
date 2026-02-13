'use client';

import { useState } from 'react';
import { MoreHorizontal, AlertTriangle, CheckCircle, Package, XCircle, Trash2, Edit } from 'lucide-react';
import { useBusinessStore } from '@/lib/store';
import { useToast } from '@/components/ui/ToastContext';
import clsx from 'clsx'; // Make sure clsx is imported, if not add it

export default function InventoryTable() {
    const { inventory, deleteInventoryItem } = useBusinessStore();
    const { addToast } = useToast();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            deleteInventoryItem(id);
            addToast(`${name} deleted`, 'info');
            setOpenMenuId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible min-h-[400px]">
            <div className="overflow-visible">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.quantity} units
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.status === 'in_stock' && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                            <CheckCircle className="w-3 h-3" />
                                            In Stock
                                        </span>
                                    )}
                                    {item.status === 'low_stock' && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                            <AlertTriangle className="w-3 h-3" />
                                            Low Stock
                                        </span>
                                    )}
                                    {item.status === 'out_of_stock' && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                            <XCircle className="w-3 h-3" />
                                            Out of Stock
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                    <button
                                        onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openMenuId === item.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setOpenMenuId(null)}
                                            />
                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 transform -translate-x-4">
                                                <div className="py-1" role="menu">
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            addToast('Edit feature coming soon', 'info');
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit Item
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id, item.name)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Item
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {inventory.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No inventory items found. Add some items to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
