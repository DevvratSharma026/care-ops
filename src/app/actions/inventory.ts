'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getInventory() {
    try {
        const inventory = await prisma.inventoryItem.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: inventory };
    } catch (error) {
        console.error('Failed to fetch inventory:', error);
        return { success: false, error: 'Failed to fetch inventory' };
    }
}

export async function updateInventoryQuantity(id: string, quantity: number) {
    try {
        const item = await prisma.inventoryItem.findUnique({ where: { id } });
        if (!item) return { success: false, error: 'Item not found' };

        const threshold = item.threshold || 10;
        let status = 'in_stock';
        if (quantity === 0) status = 'out_of_stock';
        else if (quantity <= threshold) status = 'low_stock';

        const updated = await prisma.inventoryItem.update({
            where: { id },
            data: { quantity, status }
        });

        revalidatePath('/dashboard/inventory');
        return { success: true, data: updated };
    } catch (error) {
        console.error('Failed to update inventory:', error);
        return { success: false, error: 'Failed to update inventory' };
    }
}

export async function createInventoryItem(data: {
    name: string;
    sku: string;
    category?: string;
    quantity: number;
    threshold: number;
}) {
    try {
        let status = 'in_stock';
        if (data.quantity === 0) status = 'out_of_stock';
        else if (data.quantity <= data.threshold) status = 'low_stock';

        const item = await prisma.inventoryItem.create({
            data: {
                name: data.name,
                sku: data.sku,
                category: data.category,
                quantity: data.quantity,
                threshold: data.threshold,
                status // 'in_stock' | 'low_stock' | 'out_of_stock'
            }
        });

        revalidatePath('/dashboard/inventory');
        return { success: true, data: item };
    } catch (error) {
        console.error('Failed to create inventory item:', error);
        return { success: false, error: 'Failed to create inventory item' };
    }
}

export async function deleteInventoryItem(id: string) {
    try {
        await prisma.inventoryItem.delete({
            where: { id }
        });

        revalidatePath('/dashboard/inventory');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete inventory item:', error);
        return { success: false, error: 'Failed to delete inventory item' };
    }
}
