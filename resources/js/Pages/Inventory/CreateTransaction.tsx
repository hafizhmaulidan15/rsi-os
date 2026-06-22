import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inventoryTransactionSchema, InventoryTransactionFormData } from '@/lib/schemas';

interface Props {
    items: any[];
    productionBatches: any[];
}

export default function CreateTransaction({ items, productionBatches }: Props) {
    const [productionBatchId, setProductionBatchId] = useState('');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

    const { register, handleSubmit, formState: { errors } } = useForm<InventoryTransactionFormData>({
        resolver: zodResolver(inventoryTransactionSchema),
        defaultValues: {
            item_id: '',
            transaction_type: 'in',
            quantity: '',
            notes: '',
        },
    });

    const onSubmit = (data: InventoryTransactionFormData) => {
        router.post('/inventory/transactions', {
            ...data,
            production_batch_id: productionBatchId,
            transaction_date: transactionDate,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="New Transaction" />
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/inventory">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">New Inventory Transaction</h1>
                </div>

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Item</Label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                    {...register('item_id')}
                                >
                                    <option value="">Pilih Item</option>
                                    {items.map((item: any) => (
                                        <option key={item.id} value={item.id}>{item.name} ({item.item_code})</option>
                                    ))}
                                </select>
                                {errors.item_id && <p className="text-xs text-red-400">{errors.item_id.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Type</Label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                    {...register('transaction_type')}
                                >
                                    <option value="in">IN (Masuk)</option>
                                    <option value="out">OUT (Keluar)</option>
                                    <option value="adjustment">Adjustment</option>
                                </select>
                                {errors.transaction_type && <p className="text-xs text-red-400">{errors.transaction_type.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Quantity</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    placeholder="0"
                                    {...register('quantity')}
                                />
                                {errors.quantity && <p className="text-xs text-red-400">{errors.quantity.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Production Batch (optional)</Label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                    value={productionBatchId}
                                    onChange={(e) => setProductionBatchId(e.target.value)}
                                >
                                    <option value="">-</option>
                                    {productionBatches.map((b: any) => (
                                        <option key={b.id} value={b.id}>{b.batch_number} ({b.production_type})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Date</Label>
                                <Input
                                    type="date"
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    value={transactionDate}
                                    onChange={(e) => setTransactionDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Notes</Label>
                                <textarea
                                    className="flex w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-sm text-white shadow-sm"
                                    rows={2}
                                    {...register('notes')}
                                />
                                {errors.notes && <p className="text-xs text-red-400">{errors.notes.message}</p>}
                            </div>
                            <Button type="submit" className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                                Save Transaction
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
