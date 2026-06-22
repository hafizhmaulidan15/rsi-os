import { z } from 'zod';

export const supplierSchema = z.object({
    name: z.string().min(1, 'Nama supplier wajib diisi'),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
});

export const milkBatchSchema = z.object({
    supplier_id: z.string().min(1, 'Supplier wajib dipilih'),
    received_date: z.string().min(1, 'Tanggal wajib diisi'),
    received_time: z.string().min(1, 'Jam wajib diisi'),
    volume_liter: z.string().min(1, 'Volume wajib diisi'),
    production_target: z.enum(['mozzarella', 'susu_cup']),
    notes: z.string().optional(),
});

export const qcResultSchema = z.object({
    milk_batch_id: z.string().optional(),
    production_batch_id: z.string().optional(),
    qc_type: z.enum(['raw', 'pasteurized', 'mozzarella']),
    fat: z.string().optional(),
    snf: z.string().optional(),
    density: z.string().optional(),
    protein: z.string().optional(),
    lactose: z.string().optional(),
    salts: z.string().optional(),
    total_solids: z.string().optional(),
    added_water: z.string().optional(),
    freezing_point: z.string().optional(),
    temperature: z.string().optional(),
    ph: z.string().optional(),
    peroxide: z.string().optional(),
    antibiotic: z.string().optional(),
    aroma: z.string().optional(),
    taste: z.string().optional(),
    texture: z.string().optional(),
    notes: z.string().optional(),
});

export const productionBatchSchema = z.object({
    milk_batch_id: z.string().min(1, 'Milk batch wajib dipilih'),
    production_type: z.enum(['mozzarella', 'susu_cup']),
    start_time: z.string().min(1, 'Waktu mulai wajib diisi'),
    notes: z.string().optional(),
});

export const inventoryTransactionSchema = z.object({
    item_id: z.string().min(1, 'Item wajib dipilih'),
    transaction_type: z.enum(['in', 'out', 'adjustment']),
    quantity: z.string().min(1, 'Jumlah wajib diisi'),
    notes: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
export type MilkBatchFormData = z.infer<typeof milkBatchSchema>;
export type QcResultFormData = z.infer<typeof qcResultSchema>;
export type ProductionBatchFormData = z.infer<typeof productionBatchSchema>;
export const yieldSchema = z.object({
    actual_yield_kg: z.string().min(1, 'Yield wajib diisi'),
});

export const shelfLifeSchema = z.object({
    chiller_in_date: z.string().min(1, 'Tanggal wajib diisi'),
    chiller_in_time: z.string().min(1, 'Jam wajib diisi'),
    shelf_life_days: z.string().optional(),
});

export type InventoryTransactionFormData = z.infer<typeof inventoryTransactionSchema>;
export type YieldFormData = z.infer<typeof yieldSchema>;
export type ShelfLifeFormData = z.infer<typeof shelfLifeSchema>;
