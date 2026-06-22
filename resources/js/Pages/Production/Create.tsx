import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productionBatchSchema, ProductionBatchFormData } from '@/lib/schemas';

interface Props {
    milkBatches: any[];
}

export default function ProductionCreate({ milkBatches }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<ProductionBatchFormData>({
        resolver: zodResolver(productionBatchSchema),
        defaultValues: {
            milk_batch_id: '',
            production_type: 'mozzarella',
            start_time: new Date().toISOString().slice(0, 16),
            notes: '',
        },
    });

    const onSubmit = (data: ProductionBatchFormData) => {
        router.post('/production', data);
    };

    return (
        <AuthenticatedLayout>
            <Head title="New Batch" />
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/production">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">New Production Batch</h1>
                </div>

                <Card className="border-[#1F2937] bg-[#111827]">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Milk Batch</Label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                    {...register('milk_batch_id')}
                                >
                                    <option value="">Pilih Milk Batch</option>
                                    {milkBatches.map((b: any) => (
                                        <option key={b.id} value={b.id}>
                                            {b.batch_number} — {b.supplier?.name} ({b.volume_liter}L)
                                        </option>
                                    ))}
                                </select>
                                {errors.milk_batch_id && <p className="text-xs text-red-400">{errors.milk_batch_id.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Production Type</Label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-sm text-white shadow-sm"
                                    {...register('production_type')}
                                >
                                    <option value="mozzarella">Mozzarella</option>
                                    <option value="susu_cup">Susu Cup</option>
                                </select>
                                {errors.production_type && <p className="text-xs text-red-400">{errors.production_type.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Start Time</Label>
                                <Input
                                    type="datetime-local"
                                    className="border-[#1F2937] bg-[#0F172A] text-white"
                                    {...register('start_time')}
                                />
                                {errors.start_time && <p className="text-xs text-red-400">{errors.start_time.message}</p>}
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
                                Create Batch
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
