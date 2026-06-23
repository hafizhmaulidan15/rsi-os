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

interface ItemInfo {
    id: number;
    name: string;
    item_code: string;
}

interface Props {
    items: ItemInfo[];
    productionBatches: any[];
}

type TipeTransaksi = 'masuk' | 'keluar';

export default function CreateTransaction({ items, productionBatches }: Props) {
    const [tipe, setTipe] = useState<TipeTransaksi>('masuk');
    const [productionBatchId, setProductionBatchId] = useState('');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<InventoryTransactionFormData>({
        resolver: zodResolver(inventoryTransactionSchema),
        defaultValues: {
            item_id: '',
            transaction_type: 'in',
            quantity: '',
            notes: '',
            request_by: '',
            no_sj: '',
        },
    });

    const selectedItemId = watch('item_id');
    const selectedItem = items.find((i) => String(i.id) === selectedItemId);
    const qty = Math.abs(Number(watch('quantity')) || 0);
    const previewStock = tipe === 'masuk' ? qty : -qty;

    const onSubmit = (data: InventoryTransactionFormData) => {
        router.post('/inventory/transactions', {
            ...data,
            transaction_type: tipe === 'masuk' ? 'in' : 'out',
            quantity: String(qty),
            production_batch_id: productionBatchId,
            transaction_date: transactionDate,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Transaksi Baru" />
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/inventory">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Transaksi Inventory Baru</h1>
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
                                <Label className="text-gray-400">Tipe Transaksi</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['masuk', 'keluar'] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTipe(t)}
                                            className={`h-10 rounded-md border-2 text-sm font-semibold transition-all ${
                                                tipe === t
                                                    ? t === 'masuk'
                                                        ? 'border-[#16A34A] bg-[#16A34A]/10 text-[#16A34A]'
                                                        : 'border-[#DC2626] bg-[#DC2626]/10 text-[#DC2626]'
                                                    : 'border-[#1F2937] bg-[#0F172A] text-gray-400 hover:border-gray-500'
                                            }`}
                                        >
                                            {t === 'masuk' ? '+ Masuk' : '− Keluar'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-400">
                                    Jumlah
                                    <span className={`text-xs ml-1 ${tipe === 'masuk' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                                        ({tipe === 'masuk' ? '+ Masuk' : '− Keluar'})
                                    </span>
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    placeholder="0"
                                    {...register('quantity')}
                                />
                                {errors.quantity && <p className="text-xs text-red-400">{errors.quantity.message}</p>}
                            </div>

                            {selectedItem && qty > 0 && (
                                <div className="rounded-lg border border-[#1F2937] bg-[#0F172A] px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">Stok Preview</p>
                                        <p className={`text-lg font-bold ${previewStock < 0 ? 'text-[#DC2626]' : 'text-[#2563EB]'}`}>
                                            {previewStock.toLocaleString('id-ID')}
                                            <span className="text-xs text-gray-500 ml-1">{selectedItem.name}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Tipe</p>
                                        <p className={`text-sm font-semibold ${tipe === 'masuk' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                                            {tipe === 'masuk' ? 'MASUK' : 'KELUAR'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Request By</Label>
                                    <Input
                                        className="border-[#1F2937] bg-[#0F172A] text-white"
                                        placeholder="Nama peminta"
                                        {...register('request_by')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400">No. Surat Jalan</Label>
                                    <Input
                                        className="border-[#1F2937] bg-[#0F172A] text-white"
                                        placeholder="SJ-001"
                                        {...register('no_sj')}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-400">Production Batch (opsional)</Label>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Tanggal</Label>
                                    <Input
                                        type="date"
                                        className="border-[#1F2937] bg-[#0F172A] text-white"
                                        value={transactionDate}
                                        onChange={(e) => setTransactionDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Catatan</Label>
                                    <Input
                                        className="border-[#1F2937] bg-[#0F172A] text-white"
                                        placeholder="Opsional"
                                        {...register('notes')}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="bg-[#2563EB] hover:bg-[#2563EB]/90 w-full">
                                Simpan Transaksi
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
