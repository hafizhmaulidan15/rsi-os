import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { milkBatchSchema, MilkBatchFormData } from '@/lib/schemas';

interface Props {
    milkBatch: any;
    suppliers: any[];
}

export default function MilkIntakeEdit({ milkBatch, suppliers }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<MilkBatchFormData>({
        resolver: zodResolver(milkBatchSchema),
        defaultValues: {
            supplier_id: String(milkBatch.supplier_id),
            volume_liter: String(milkBatch.volume_liter),
            production_target: milkBatch.production_target,
            received_date: milkBatch.received_date,
            received_time: milkBatch.received_time,
            notes: milkBatch.notes || '',
        },
    });

    const onSubmit = (data: MilkBatchFormData) => {
        router.put(`/milk-intake/${milkBatch.id}`, data);
    };

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus penerimaan ini?')) {
            router.delete(`/milk-intake/${milkBatch.id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Penerimaan" />
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/milk-intake">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Edit Penerimaan Susu</h1>
                </div>

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Batch Number</Label>
                                <Input
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    value={milkBatch.batch_number}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Supplier</Label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                    {...register('supplier_id')}
                                >
                                    <option value="">Pilih Supplier</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.supplier_code})</option>
                                    ))}
                                </select>
                                {errors.supplier_id && <p className="text-xs text-red-400">{errors.supplier_id.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Volume (Liter)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    placeholder="100.00"
                                    {...register('volume_liter')}
                                />
                                {errors.volume_liter && <p className="text-xs text-red-400">{errors.volume_liter.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Target Produksi</Label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                    {...register('production_target')}
                                >
                                    <option value="mozzarella">Mozzarella</option>
                                    <option value="susu_cup">Susu Cup</option>
                                </select>
                                {errors.production_target && <p className="text-xs text-red-400">{errors.production_target.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Tanggal</Label>
                                    <Input
                                        type="date"
                                        className="border-[#1F2937] bg-[#0F172A] text-white"
                                        {...register('received_date')}
                                    />
                                    {errors.received_date && <p className="text-xs text-red-400">{errors.received_date.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Jam</Label>
                                    <Input
                                        type="time"
                                        className="border-[#1F2937] bg-[#0F172A] text-white"
                                        {...register('received_time')}
                                    />
                                    {errors.received_time && <p className="text-xs text-red-400">{errors.received_time.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Catatan</Label>
                                <textarea
                                    className="flex w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-sm text-white shadow-sm"
                                    rows={2}
                                    placeholder="Catatan (opsional)"
                                    {...register('notes')}
                                />
                                {errors.notes && <p className="text-xs text-red-400">{errors.notes.message}</p>}
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                                    Update
                                </Button>
                                <Button type="button" variant="destructive" onClick={handleDelete}>
                                    Hapus
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
