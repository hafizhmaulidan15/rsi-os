import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { DataTable } from '@/Components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface InventoryItem {
    id: number;
    item_code: string;
    name: string;
    category: string;
    unit: string;
    minimum_stock: number;
    is_active: boolean;
}

interface Props {
    items: { data: InventoryItem[] };
}

const itemSchema = z.object({
    item_code: z.string().min(1, 'Kode item wajib diisi'),
    name: z.string().min(1, 'Nama item wajib diisi'),
    category: z.enum(['mozzarella', 'susu_cup', 'packaging']),
    unit: z.string().min(1, 'Satuan wajib diisi'),
    minimum_stock: z.string().min(1, 'Min stok wajib diisi'),
    is_active: z.boolean().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

function ItemFormModal({ item, onClose }: { item?: InventoryItem | null; onClose: () => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: item ? {
            item_code: item.item_code,
            name: item.name,
            category: item.category as 'mozzarella' | 'susu_cup' | 'packaging',
            unit: item.unit,
            minimum_stock: String(item.minimum_stock),
        } : {
            item_code: '',
            name: '',
            category: 'packaging',
            unit: '',
            minimum_stock: '0',
        },
    });

    const onSubmit = (data: ItemFormData) => {
        const payload = { ...data, is_active: true };
        if (item) {
            router.put(`/inventory/items/${item.id}`, payload, {
                onSuccess: () => onClose(),
            });
        } else {
            router.post('/inventory/items', payload, {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md border-[#1F2937] bg-[#111827]">
                <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-bold text-white">{item ? 'Edit Item' : 'Tambah Item'}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-400">Kode Item</Label>
                            <Input className="border-[#1F2937] bg-[#0F172A] text-white" {...register('item_code')} />
                            {errors.item_code && <p className="text-xs text-red-400">{errors.item_code.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400">Nama Item</Label>
                            <Input className="border-[#1F2937] bg-[#0F172A] text-white" {...register('name')} />
                            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400">Kategori</Label>
                            <select className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm" {...register('category')}>
                                <option value="mozzarella">Mozzarella</option>
                                <option value="susu_cup">Susu Cup</option>
                                <option value="packaging">Packaging</option>
                            </select>
                            {errors.category && <p className="text-xs text-red-400">{errors.category.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400">Satuan</Label>
                            <Input className="border-[#1F2937] bg-[#0F172A] text-white" placeholder="kg, pcs, pack" {...register('unit')} />
                            {errors.unit && <p className="text-xs text-red-400">{errors.unit.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400">Minimal Stok</Label>
                            <Input type="number" className="border-[#1F2937] bg-[#0F172A] text-white" {...register('minimum_stock')} />
                            {errors.minimum_stock && <p className="text-xs text-red-400">{errors.minimum_stock.message}</p>}
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="bg-[#2563EB] hover:bg-[#2563EB]/90">Simpan</Button>
                            <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function InventoryItems({ items }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const handleDelete = (item: InventoryItem) => {
        if (confirm(`Yakin ingin menghapus item "${item.name}"?`)) {
            router.delete(`/inventory/items/${item.id}`);
        }
    };

    const columns: ColumnDef<InventoryItem>[] = [
        { accessorKey: 'item_code', header: 'Kode', cell: ({ row }) => <span className="font-mono text-[#2563EB]">{row.getValue('item_code')}</span> },
        { accessorKey: 'name', header: 'Nama' },
        { accessorKey: 'category', header: 'Kategori', cell: ({ row }) => <Badge variant="default">{row.getValue('category')}</Badge> },
        { accessorKey: 'unit', header: 'Satuan' },
        { accessorKey: 'minimum_stock', header: 'Min Stok' },
        {
            accessorKey: 'is_active',
            header: 'Aktif',
            cell: ({ row }) => <Badge variant={row.getValue('is_active') ? 'success' : 'danger'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge>,
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingItem(row.original); setShowModal(true); }}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Inventory Items" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Inventory Items</h1>
                    <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90" onClick={() => { setEditingItem(null); setShowModal(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Item
                    </Button>
                </div>

                <DataTable columns={columns} data={items.data} searchColumn="name" searchPlaceholder="Cari item..." />

                {showModal && (
                    <ItemFormModal item={editingItem} onClose={() => { setShowModal(false); setEditingItem(null); }} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
